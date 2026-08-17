import re

def fix_sql_dump(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all AUTO_INCREMENT modifications
    # Example: ALTER TABLE `fruta` MODIFY `frutaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
    auto_inc_pattern = re.compile(r"ALTER TABLE `(\w+)`\s+MODIFY `(\w+)` ([^;]+) AUTO_INCREMENT[^;]*;")
    auto_incs = auto_inc_pattern.findall(content)

    # Find all PRIMARY KEY additions
    # Example: ALTER TABLE `fruta` ADD PRIMARY KEY (`frutaId`);
    # We might have multiple keys, so let's just grab the PKs
    pk_pattern = re.compile(r"ALTER TABLE `(\w+)`\s+ADD PRIMARY KEY \(`(\w+)`\)(?: USING BTREE)?(?:,\s*ADD [^;]+)*;")
    pks = pk_pattern.findall(content)

    # Map table to its PK and Auto Inc column
    modifications = {}
    for table, col, col_type in auto_incs:
        modifications[table] = {'col': col, 'type': col_type, 'is_pk': False}
    
    for table, col in pks:
        if table in modifications and modifications[table]['col'] == col:
            modifications[table]['is_pk'] = True
        elif table not in modifications:
            modifications[table] = {'col': col, 'is_pk': True, 'type': ''}

    # Now modify the CREATE TABLE statements
    for table, info in modifications.items():
        col = info['col']
        # Find the line in CREATE TABLE `table` that defines `col`
        # It usually looks like:   `col` int(11) NOT NULL,
        search_pattern = re.compile(rf"(CREATE TABLE `{table}` \([\s\S]*?)`{col}` ([^,]+),", re.IGNORECASE)
        
        def replace_col(match):
            prefix = match.group(1)
            col_def = match.group(2)
            new_def = f"`{col}` {col_def}"
            if table in [t for t, c, _ in auto_incs]:
                if "AUTO_INCREMENT" not in new_def:
                    new_def += " AUTO_INCREMENT"
            if info['is_pk'] and "PRIMARY KEY" not in new_def:
                new_def += " PRIMARY KEY"
            return f"{prefix}{new_def},"

        content = search_pattern.sub(replace_col, content)

    # Remove the ALTER TABLE MODIFY AUTO_INCREMENT blocks
    content = re.sub(r"ALTER TABLE `\w+`\s+MODIFY `\w+` [^;]+ AUTO_INCREMENT[^;]*;\s*", "", content)
    
    # Remove the ALTER TABLE ADD PRIMARY KEY blocks
    # Note: some have multiple ADD KEYs in the same block. 
    # To be safe, let's just remove the ADD PRIMARY KEY part.
    def remove_pk(match):
        inner = match.group(0)
        # If it only has ADD PRIMARY KEY
        if "ADD KEY" not in inner and "ADD UNIQUE KEY" not in inner:
            return ""
        # If it has others, remove just the ADD PRIMARY KEY part
        inner = re.sub(r"ADD PRIMARY KEY \(`\w+`\)(?: USING BTREE)?,\s*", "", inner)
        return inner

    content = re.sub(r"ALTER TABLE `\w+`\s+ADD PRIMARY KEY \(`\w+`\)(?: USING BTREE)?(?:,\s*ADD (?:UNIQUE )?KEY [^;]+)*;\s*", remove_pk, content)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_sql_dump('db_frutas_tidb_clean.sql', 'db_frutas_tidb_final.sql')
    print("El archivo ha sido corregido para TiDB.")
