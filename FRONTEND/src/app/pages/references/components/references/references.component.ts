import { Component, model, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../../../shared/material.module';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';

export interface Reference {
  id: number;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi: string;
  tags: string[];
}

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.css'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ReferencesComponent implements OnInit, AfterViewInit {
  searchQuery: string = '';
  displayedColumns: string[] = ['authors', 'year', 'title', 'journal', 'doi'];
  dataSource = new MatTableDataSource<Reference>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  references: Reference[] = [
    {
      id: 1,
      authors: "Paz-Y\u00e9pez, A. C",
      year: 2019,
      title: "Influencia de factores inherentes al alimento y al individuo sobre la digestibilidad de l\u00edpidos de origen vegetal [Tesis doctoral, Universitat Polit\u00e8cnica de Val\u00e8ncia]",
      journal: "Unknown",
      doi: "https://aplicat.upv.es/exploraupv/ficha-tesis/tesis/11710?busqueda=Patologia+vegetal",
      tags: ['Otros']
    },
    {
      id: 2,
      authors: "Paz-Y\u00e9pez, C., Calvo-Lerma, J., Asensio-Grau, A., Heredia, A., & Andr\u00e9s, A",
      year: 2020,
      title: "Impact of Processing and Intestinal Conditions on in Vitro Digestion of Chia (Salvia hispanica) Seeds and Derivatives",
      journal: "Foods 2020, Vol. 9, Page 290, 9(3), 290",
      doi: "https://doi.org/10.3390/FOODS9030290",
      tags: ['Otros']
    },
    {
      id: 3,
      authors: "Paz-Y\u00e9pez, C., Peinado, I., Heredia, A., & Andr\u00e9s, A",
      year: 2019,
      title: "Lipids digestibility and polyphenols release under in vitro digestion of dark, milk and white chocolate",
      journal: "Journal of Functional Foods, 52, 196\u2013203",
      doi: "https://doi.org/10.1016/J.JFF.2018.10.028",
      tags: ['Otros']
    },
    {
      id: 4,
      authors: "Minekus, M., Alminger, M., Alvito, P., Ballance, S., Bohn, T., Bourlieu, C., Carri\u00e8re, F., Bout...",
      year: 2014,
      title: "A standardised static in vitro digestion method suitable for food \u2013 an international consensus",
      journal: "Food & Function, 5(6), 1113\u20131124",
      doi: "https://doi.org/10.1039/C3FO60702J",
      tags: ['Otros']
    },
    {
      id: 5,
      authors: "Minekus, M., Alminger, M., Alvito, P., Ballance, S., Bohn, T., Bourlieu, C., Carri\u00e8re, F., Bout...",
      year: 2014,
      title: "A standardised static in vitro digestion method suitable for food \u2013 an international consensus",
      journal: "Food & Function, 5(6), 1113-1124",
      doi: "https://doi.org/10.1039/C3FO60702J",
      tags: ['Otros']
    },
    {
      id: 6,
      authors: "Abdelwahed, W., Degobert, G., Stainmesse, S., & Fessi, H",
      year: 2006,
      title: "Freeze-drying of nanoparticles: Formulation, process and storage considerations",
      journal: "Advanced Drug Delivery Reviews, 58(15), 1688\u20131713",
      doi: "https://doi.org/10.1016/J.ADDR.2006.09.017",
      tags: ['Otros']
    },
    {
      id: 7,
      authors: "Akonor, P. T",
      year: 2020,
      title: "Optimization of a fruit juice cocktail containing soursop, pineapple, orange and mango using mixture design",
      journal: "Scientific African, 8, e00368",
      doi: "https://doi.org/10.1016/j.sciaf.2020.e00368",
      tags: ['Otros']
    },
    {
      id: 8,
      authors: "Al-Radadi, Najlaa S., Widad M. Al-Bishri, Neveen A. Salem, and Shaimaa A. ElShebiney",
      year: 2024,
      title: "Plant-Mediated Green Synthesis of Gold Nanoparticles Using an Aqueous Extract of Passiflora Ligularis, Optimization, Characterizations, and Their Neuroprotective Effect on Propionic Acid-Induced Autism in Wistar Rats",
      journal: "Saudi Pharmaceutical Journal\u202f: SPJ\u202f: The Official Publication of the Saudi Pharmaceutical Society 32(2)",
      doi: "doi:10.1016/J.JSPS.2023.101921",
      tags: ['Otros']
    },
    {
      id: 9,
      authors: "Anda\u00e7 \u00d6zt\u00fcrk, S., & Yaman, M",
      year: 2022,
      title: "Investigation of bioaccessibility of vitamin C in various fruits and vegetables under in vitro gastrointestinal digestion system",
      journal: "Journal of Food Measurement and Characterization, 16(5), 3735-3742",
      doi: "https://doi.org/10.1007/s11694-022-01486-z",
      tags: ['Otros']
    },
    {
      id: 10,
      authors: "Angel-Isaza, Jaime, Juan Carlos Carmona-Hernandez, Clara Helena Gonz\u00e1lez-Correa, and William Vi...",
      year: 2023,
      title: "Potential Hypoglycemic and Antilipidemic Activity of Polyphenols from Passiflora Ligularis (Granadilla)",
      journal: "Molecules 2023, Vol. 28, Page 3551 28(8):3551",
      doi: "doi:10.3390/MOLECULES28083551",
      tags: ['Otros']
    },
    {
      id: 11,
      authors: "An\u00edbal Arturo, Villac\u00eds-Ald\u00e1z, L. A., Viera-Arroyo, W. F., Jacome Montesdeoca, R. I., Esp\u00edn-Chi...",
      year: 2019,
      title: "Evaluaci\u00f3n de nuevas tecnolog\u00edas de producci\u00f3n limpia de la mora de castilla (Rubus glaucus Benth) en la zona Andina de Ecuador, para un buen vivir de fructicultores",
      journal: "Journal of the Selva Andina biosphere. In Journal of the Selva Andina Biosphere, 7(1)",
      doi: "http://www.scielo.org.bo/scielo.php?script=sci_arttext&pid=S2308-38592019000100007&lng=es&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 12,
      authors: "A\u00f1ibarro-Ortega, Mikel, Maria In\u00eas Dias, Jovana Petrovi\u0107, Alexis Pereira, Marina Sokovi\u0107, Lilli...",
      year: 2025,
      title: "Nutrients, Phytochemicals, and In Vitro Antioxidant and Antimicrobial Activities of Lulo (Solanum Quitoense Lam.) Fruit Pulp, Peel, and Seeds",
      journal: "Foods 14(12):2083",
      doi: "https://www.mdpi.com/2304-8158/14/12/2083",
      tags: ['Otros']
    },
    {
      id: 13,
      authors: "A\u00f1ibarro-Ortega, Mikel, Maria In\u00eas Dias, Jovana Petrovi\u0107, Filipa Mandim, Sonia N\u00fa\u00f1ez, Marina So...",
      year: 2025,
      title: "Nutrients, Phytochemicals, and In Vitro Biological Activities of Goldenberry (Physalis Peruviana L.) Fruit and Calyx",
      journal: "Plants 14(3):327",
      doi: "https://www.mdpi.com/2223-7747/14/3/327",
      tags: ['Otros']
    },
    {
      id: 14,
      authors: "Araya L, H., Clavijo R, C., & Herrera, C",
      year: 2006,
      title: "Capacidad antioxidante de frutas y verduras cultivados en Chile*",
      journal: "Archivos Latinoamericanos de Nutrici\u00f3n, 56(4), 361-365",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 15,
      authors: "Arteaga, Y",
      year: 2013,
      title: "Estudio del desperdicio del muc\u00edlago de cacao en el cant\u00f3n Naranjal (Provincia del Guayas)",
      journal: "ECA Sinergia, 4(1), 49-59",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 16,
      authors: "Ayala, A. A., Serna C, L., & Mosquera V, E",
      year: 2010,
      title: "Liofilizaci\u00f3n de pitahaya amarilla (Selenicereus megalanthus)",
      journal: "Vitae, 17(2), 122-127",
      doi: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S0121-40042010000200002&lng=en&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 17,
      authors: "Bas-Bellver, C., Barrera, C., Betoret, N., & Segu\u00ed, L",
      year: 2023,
      title: "Effect of Processing and In Vitro Digestion on Bioactive Constituents of Powdered IV Range Carrot (Daucus carota, L",
      journal: ") Wastes. Foods, 12(4), 731",
      doi: "https://doi.org/10.3390/foods12040731",
      tags: ['Otros']
    },
    {
      id: 18,
      authors: "Bastos, C., Fonseca, D., Marques, E., & Pinho, C",
      year: 2023,
      title: "Avalia\u00e7\u00e3o de diferentes atividades biol\u00f3gicas do extrato aquoso de um produto fitoter\u00e1pico com moringa e aroma de lim\u00e3o",
      journal: "Proceedings of Research and Practice in Allied and Environmental Health, 1(1), 32\u201332",
      doi: "https://doi.org/10.26537/PRPAEH.V1I1.5141",
      tags: ['Otros']
    },
    {
      id: 19,
      authors: "Belmonte-Herrera, B. H., Dom\u00ednguez-Avila, J. A., Ayala-Zavala, J. F., Valenzuela-Melendres, M.,...",
      year: 2023,
      title: "Optimization and In Vitro Digestion of a Guava (Psidium guajava), Mamey (Pouteria sapota) and Stevia (Stevia rebaudiana) Functional Beverage",
      journal: "Foods, 13(1), 142",
      doi: "https://doi.org/10.3390/foods13010142",
      tags: ['Otros']
    },
    {
      id: 20,
      authors: "Bernacci, L. C., Soares-Scott, M. D., Junqueira, N. T. V., Passos, I. R. da S., & Meletti, L. M. M",
      year: 2008,
      title: "Passiflora edulis: The correct taxonomic way to cite the yellow passion fruit (and of others colors)",
      journal: "Revista Brasileira de Fruticultura, 30, 566-576",
      doi: "https://doi.org/10.1590/S0100-29452008000200053",
      tags: ['Otros']
    },
    {
      id: 21,
      authors: "Bhatt, S., Lee, J., Deutsch, J., Ayaz, H., Fulton, B., & Suri, R",
      year: 2018,
      title: "From food waste to value-added surplus products (VASP): Consumer acceptance of a novel food product category",
      journal: "Journal of Consumer Behaviour, 17(1), 57\u201363",
      doi: "https://doi.org/10.1002/CB.1689",
      tags: ['Otros']
    },
    {
      id: 22,
      authors: "Bol\u00edvar, M",
      year: 2012,
      title: "El cultivo de la pi\u00f1a y el clima en el Ecuador",
      journal: "Estudios e Investigaciones Meteorol\u00f3gicas INAMHI - Ecuador",
      doi: "https://www.inamhi.gob.ec/meteorologia/articulos/agrometeorologia/El%20%20cultivo%20de%20la%20pi%C3%B1a%20y%20el%20clima%20en%20el%20Ecuador.pdf",
      tags: ['Otros']
    },
    {
      id: 23,
      authors: "Brodkorb, A., Egger, L., Alminger, M., Alvito, P., Assun\u00e7\u00e3o, R., Ballance, S., Bohn, T., Bourli...",
      year: 2019,
      title: "INFOGEST static in vitro simulation of gastrointestinal food digestion",
      journal: "Nature Protocols, 14(4), 991\u20131014",
      doi: "https://doi.org/10.1038/S41596-018-0119-1;SUBJMETA",
      tags: ['Otros']
    },
    {
      id: 24,
      authors: "Buniowska, M., Arrigoni, E., Znamirowska, A., Blesa, J., Fr\u00edgola, A., & Esteve, M. J",
      year: 2019,
      title: "Liberation and Micellarization of Carotenoids from Different Smoothies after Thermal and Ultrasound Treatments",
      journal: "Foods, 8(10), 492",
      doi: "https://doi.org/10.3390/FOODS8100492",
      tags: ['Otros']
    },
    {
      id: 25,
      authors: "Buono, S., Aguirre, C., Abdo, G., Perondi, H., & Ansonnaud, Gustavo",
      year: 2018,
      title: "Tomate de \u00e1rbol (Solanun betaceum)(Cav), Sendt",
      journal: "(Instituto Interamericano de Cooperaci\u00f3n para la Agricultura (IICA))",
      doi: "https://www.procisur.org.uy/adjuntos/01e8c39fb854_e-arbol-PROCISUR.pdf",
      tags: ['Otros']
    },
    {
      id: 26,
      authors: "Cabezas-Ter\u00e1n, K., Grootaert, C., Ortiz, J., Donoso, S., Ruales, J., Van Bockstaele, F., Van Ca...",
      year: 2023,
      title: "In vitro bioaccessibility and uptake of \u03b2-carotene from encapsulated carotenoids from mango by-products in a coupled gastrointestinal digestion/Caco-2 cell model",
      journal: "Food Research International (Ottawa, Ont.), 164, 112301",
      doi: "https://doi.org/10.1016/j.foodres.2022.112301",
      tags: ['Otros']
    },
    {
      id: 27,
      authors: "C\u00e1diz-Gurrea, M. L., J. Lozano-Sanchez, M. Contreras-G\u00e1mez, L. Legeai-Mallet, S. Fern\u00e1ndez-Arro...",
      year: 2014,
      title: "Isolation, Comprehensive Characterization and Antioxidant Activities of Theobroma Cacao Extract",
      journal: "Journal of Functional Foods 10:485\u201398",
      doi: "doi:10.1016/J.JFF.2014.07.016",
      tags: ['Otros']
    },
    {
      id: 28,
      authors: "Campos-Rodriguez, J., Acosta-Coral, K., Moreno-Rojo, C., & Paucar-Menacho, L. M",
      year: 2023,
      title: "Maracuy\u00e1 (Passiflora edulis): Composici\u00f3n nutricional, compuestos bioactivos, aprovechamiento de subproductos, biocontrol y fertilizaci\u00f3n org\u00e1nica en el cultivo",
      journal: "Scientia Agropecuaria, 14(4)",
      doi: "https://doi.org/10.17268/sci.agropecu.2023.040",
      tags: ['Otros']
    },
    {
      id: 29,
      authors: "Ca\u00f1as, S., Rebollo-Hernanz, M., Berm\u00fadez-G\u00f3mez, P., Rodr\u00edguez-Rodr\u00edguez, P., Braojos, C., Gil-R...",
      year: 2023,
      title: "Radical Scavenging and Cellular Antioxidant Activity of the Cocoa Shell Phenolic Compounds after Simulated Digestion",
      journal: "Antioxidants, 12(5), 1007",
      doi: "https://doi.org/10.3390/antiox12051007",
      tags: ['Otros']
    },
    {
      id: 30,
      authors: "Candra, Andy, and Haile Fentahun Darge",
      year: 2025,
      title: "Impact of Honey-Enriched Soursop Leaves (Annona Muricata) Kombucha on Lipid Profiles and Hypoglycemic Properties: An in-Vivo Study",
      journal: "Biocatalysis and Agricultural Biotechnology 68:103713",
      doi: "doi:10.1016/J.BCAB.2025.103713",
      tags: ['Otros']
    },
    {
      id: 31,
      authors: "Carvajal de Pab\u00f3n, L. M., Turbay, S., Rojano, B., \u00c1lvarez, L. M., Luz Restrepo, S., \u00c1lvarez, J....",
      year: 2011,
      title: "Algunas especies de Passiflora y su capacidad antioxidante",
      journal: "Revista Cubana de Plantas Medicinales, 16(4), 354-363",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 32,
      authors: "Castro, M. A., Ram\u00edrez, D. G., Osorio, V. \u00c1., & Ruiz, S. M",
      year: 2021,
      title: "Floral and reproductive biology of Matisia cordata (fam: Malvaceae)",
      journal: "Revista Brasileira de Fruticultura, 43(2), e-469",
      doi: "https://doi.org/10.1590/0100-29452021469",
      tags: ['Otros']
    },
    {
      id: 33,
      authors: "Charan, S. M., Gomez, S., Sheela, K. B., Meagle Joseph, P., & Sruthi, C. V",
      year: 2018,
      title: "Quality characteristics and antioxidant activity of passion fruit (Passiflora edulis sims",
      journal: ") accessions. Indian Journal of Horticulture, 75(2), 185\u2013190",
      doi: "https://doi.org/10.5958/0974-0112.2018.00034.8",
      tags: ['Otros']
    },
    {
      id: 34,
      authors: "Chumacero, J. S., Lazo, R., Navarro, E., Quinteros, A., Chumacero, J. S., Lazo, R., Navarro, E....",
      year: 2022,
      title: "Preservation of camu camu (Myrciaria dubia Kunth McVaugh) by lyophilization",
      journal: "Informaci\u00f3n Tecnol\u00f3gica, 33(5), 11\u201318",
      doi: "https://doi.org/10.4067/S0718-07642022000500011",
      tags: ['Otros']
    },
    {
      id: 35,
      authors: "Coelho, M. C., Ribeiro, T. B., Oliveira, C., Batista, P., Castro, P., Monforte, A. R., Rodrigue...",
      year: 2021,
      title: "In Vitro Gastrointestinal Digestion Impact on the Bioaccessibility and Antioxidant Capacity of Bioactive Compounds from Tomato Flours Obtained after Conventional and Ohmic Heating Extraction",
      journal: "Foods 2021, Vol. 10, Page 554, 10(3), 554",
      doi: "https://doi.org/10.3390/FOODS10030554",
      tags: ['Otros']
    },
    {
      id: 36,
      authors: "Constituci\u00f3n de la Rep\u00fablica del Ecuador",
      year: 2008,
      title: "Constituci\u00f3n de la Rep\u00fablica del Ecuador",
      journal: "Unknown",
      doi: "https://www.defensa.gob.ec/wp-content/uploads/downloads/2021/02/Constitucion-de-la-Republica-del-Ecuador_act_ene-2021.pdf",
      tags: ['Otros']
    },
    {
      id: 37,
      authors: "CORPEI",
      year: 2019,
      title: "Frutas ex\u00f3ticas ecuatorianas en mercados internacionales",
      journal: "CORPEI",
      doi: "https://corpei.org/2019/01/02/frutas-exoticas-ecuatorianas-en-mercados-internacionales/",
      tags: ['Otros']
    },
    {
      id: 38,
      authors: "Corr\u00eaa, Luiz Claudio, Carlos Antonio F. Santos, Fabio Vianello, and Giuseppina Pace P. Lima",
      year: 2011,
      title: "Antioxidant Content in Guava (Psidium Guajava) and Ara\u00e7\u00e1 (Psidium Spp.) Germplasm from Different Brazilian Regions",
      journal: "Plant Genetic Resources 9(3):384\u201391",
      doi: "doi:10.1017/S1479262111000025",
      tags: ['Otros']
    },
    {
      id: 39,
      authors: "Co\u015fkun, N., Sar\u0131ta\u015f, S., Jaouhari, Y., Bordiga, M., & Karav, S",
      year: 2024,
      title: "The Impact of Freeze Drying on Bioactivity and Physical Properties of Food Products",
      journal: "Applied Sciences (Switzerland), 14(20)",
      doi: "https://doi.org/10.3390/APP14209183",
      tags: ['Otros']
    },
    {
      id: 40,
      authors: "Crozier, A., Ashihara, H., & Tomas-Barberan, F. A",
      year: 2011,
      title: "Teas, cocoa and coffee: Plant secondary metabolites and health (1st ed",
      journal: "). Wiley-Blackwell",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 41,
      authors: "Cuellar, F., Ariza, E., Anzola, C., & Restrepo, P",
      year: 2013,
      title: "Estudio de la capacidad antioxidante del araz\u00e1 (Eugenia stipitata) durante la maduraci\u00f3n",
      journal: "Revista colombiana de qu\u00edmica (Vol. 42, Issue 2). Universidad Nacional de Colombia, Departamento de Qu\u00edmica",
      doi: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S0120-28042013000200003&lng=en&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 42,
      authors: "De Le\u00f3n, R. M",
      year: 2019,
      title: "Determinaci\u00f3n de la estabilidad en la capacidad antioxidante de la harina del epicardio de mango (Mang\u00edfera indica) [Tesis de pregrado, Universidad de San Carlos de Guatemala]",
      journal: "Unknown",
      doi: "http://www.repositorio.usac.edu.gt/12893/1/200945913.pdf",
      tags: ['Otros']
    },
    {
      id: 43,
      authors: "Dietz, C., Yang, Q., & Ford, R",
      year: 2022,
      title: "The impact of time standardising TCATA by modality data on the multisensory profile of beer",
      journal: "Food Quality and Preference, 98, 104506",
      doi: "https://doi.org/10.1016/J.FOODQUAL.2021.104506",
      tags: ['Otros']
    },
    {
      id: 44,
      authors: "Ding, Y., Liu, X., Bi, J., Wu, X., Li, X., Liu, J., Liu, D., Trych, U., & Marsza\u0142ek, K",
      year: 2020,
      title: "Effects of pectin, sugar and pH on the \u03b2-Carotene bioaccessibility in simulated juice systems",
      journal: "LWT, 124, 109125",
      doi: "https://doi.org/10.1016/J.LWT.2020.109125",
      tags: ['Otros']
    },
    {
      id: 45,
      authors: "Do, Yen Vy, Quynh Nhu Thi Le, Nguyen Huu Nghia, Ngoc Duc Vu, Nhi Thi Yen Tran, N. T. Bay, Thi T...",
      year: 2024,
      title: "Assessment of the Changes in Product Characteristics, Total Ascorbic Acid, Total Flavonoid Content, Total Polyphenol Content and Antioxidant Activity of Dried Soursop Fruit Tea (Annona Muricata L.) during Product Storage",
      journal: "Food Science and Nutrition 12(4):2679\u201391",
      doi: "doi:10.1002/FSN3.3949;WGROUP:STRING:PUBLICATION",
      tags: ['Otros']
    },
    {
      id: 46,
      authors: "Encuesta Nacional de Salud y Nutrici\u00f3n",
      year: 2013,
      title: "Encuesta Nacional de Salud y Nutrici\u00f3n \u2013 ENSANUT \u2013 Ministerio de Salud P\u00fablica",
      journal: "Unknown",
      doi: "https://www.salud.gob.ec/encuesta-nacional-de-salud-y-nutricion-ensanut/",
      tags: ['Otros']
    },
    {
      id: 47,
      authors: "Esteves, T., & Palacios Barrio, A",
      year: 2016,
      title: "An\u00e1lisis comparativo del mercado de hebras de T\u00e9 pre-empacadas y por peso Autores",
      journal: "Unknown",
      doi: "http://biblioteca2.ucab.edu.ve/anexos/biblioteca/marc/texto/AAT3909.pdf",
      tags: ['Otros']
    },
    {
      id: 48,
      authors: "Etcheverry, P., Grusak, M. A., & Fleige, L. E",
      year: 2012,
      title: "Application of in vitro bioaccessibility and bioavailability methods for calcium, carotenoids, folate, iron, magnesium, polyphenols, zinc, and vitamins B(6), B(12), D, and E",
      journal: "Frontiers in Physiology, 3, 317",
      doi: "https://doi.org/10.3389/fphys.2012.00317",
      tags: ['Otros']
    },
    {
      id: 49,
      authors: "Faic\u00e1n-Mej\u00eda, C., Encalada-Alvarado, C., & Becerril-Rom\u00e1n, A",
      year: 2016,
      title: "Descripci\u00f3n agron\u00f3mica del cultivo de tomate de \u00e1rbol (Solanum betaceum Cav",
      journal: ")",
      doi: "https://core.ac.uk/reader/249320590",
      tags: ['Otros']
    },
    {
      id: 50,
      authors: "Fajardo-Ort\u00edz, A. G., Legaria-Solano, J. P., Granados-Moreno, J. E., Mart\u00ednez-Sol\u00eds, J., & Celi...",
      year: 2019,
      title: "Revista fitotecnia mexicana",
      journal: "In Revista fitotecnia mexicana (Vol. 42, Issue 3). Sociedad Mexicana de Fitogen\u00e9tica",
      doi: "http://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0187-73802019000300289&lng=es&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 51,
      authors: "Falcon\u00ed, J",
      year: 2024,
      title: "* \u201cEfectos del tiempo de congelaci\u00f3n en las caracter\u00edsticas bromatol\u00f3gicas de Araz\u00e1 (Eugenia stipitata) aplicando modelos matem\u00e1ticos\u201d | Revista Alfa*",
      journal: "Unknown",
      doi: "https://revistaalfa.org/index.php/revistaalfa/article/view/355/868",
      tags: ['Otros']
    },
    {
      id: 52,
      authors: "FAO",
      year: 2024,
      title: "D\u00eda Internacional del T\u00e9 | 21 de mayo",
      journal: "Unknown",
      doi: "https://www.fao.org/international-tea-day/es",
      tags: ['Otros']
    },
    {
      id: 53,
      authors: "Farias, D. de P., Fernandes de Ara\u00fajo, F., Neri-Numa, I. A., Lu\u00edsa Dias-Audibert, F., Delafiori...",
      year: 2021,
      title: "Efecto de la digesti\u00f3n in vitro sobre la biodisponibilidad y bioactividad de los compuestos fen\u00f3licos en fracciones del fruto de Eugenia pyriformis\u2014ScienceDirect",
      journal: "Unknown",
      doi: "https://doi.org/10.1016/j.foodres.2021.110767",
      tags: ['Otros']
    },
    {
      id: 54,
      authors: "Fern\u00e1ndez-Garc\u00eda, E., Carvajal-L\u00e9rida, I., & P\u00e9rez-G\u00e1lvez, A",
      year: 2009,
      title: "In vitro bioaccessibility assessment as a prediction tool of nutritional efficiency",
      journal: "Nutrition Research, 29(11), 751-760",
      doi: "https://doi.org/10.1016/j.nutres.2009.09.016",
      tags: ['Otros']
    },
    {
      id: 55,
      authors: "Franco, Cartagena V, Guillermo Correa, Benjam\u00edn Rojano, & Ana Piedrahita C",
      year: 2014,
      title: "Antioxidant activity of Passiflora edulis Sims (purple passion fruit) juice in the postharvest period",
      journal: "Revista Cubana de Plantas Medicinales, 19(1), 154\u2013166",
      doi: "http://scielo.sld.cuhttp://scielo.sld.cu",
      tags: ['Otros']
    },
    {
      id: 56,
      authors: "Franco, G., Bernal, J., Giraldo, C., & Tamayo, P",
      year: 2002,
      title: "El cultivo del lulo\u202f:manual t\u00e9cnico",
      journal: "Unknown",
      doi: "http://hdl.handle.net/20.500.12324/13150",
      tags: ['Otros']
    },
    {
      id: 57,
      authors: "Galecio Julca, M. A., Pe\u00f1a Seminario, T. A., Pe\u00f1a Castillo, R. A., & Rojas Pintado, B",
      year: 2023,
      title: "Efecto de la fertilizaci\u00f3n org\u00e1nica y densidad para la producci\u00f3n de granadilla Passiflora ligularis Juss eco tipo Colombiana en la Comunidad Campesina San Miguel de Tabaconas",
      journal: "Revista Cient\u00edfica Pakamuros, 8(3)",
      doi: "https://doi.org/10.37787/D8CGJT65",
      tags: ['Otros']
    },
    {
      id: 58,
      authors: "Gaona-Gonzaga, P., V\u00e1squez-Rojas, L., Aguayo-Pacas, S., Viera-Arroyo, W., Viteri-D\u00edaz, P., Soto...",
      year: 2020,
      title: "Response of sweet passion fruit (Passiflora liguralis Juss) cultivar \u201cColombiana\u201d to the supply of nitrogen and potassium through fertirrigation",
      journal: "Manglar, 17(1), 75\u201382",
      doi: "https://doi.org/10.17268/MANGLAR.2020.012",
      tags: ['Otros']
    },
    {
      id: 59,
      authors: "Garc\u00eda-Chac\u00f3n, J. M., Rodr\u00edguez-Pulido, F. J., Heredia, F. J., Gonz\u00e1lez-Miret, M. L., & Osorio, C",
      year: 2024,
      title: "Characterization and bioaccessibility assessment of bioactive compounds from camu-camu (Myrciaria dubia) powders and their food applications",
      journal: "Food Research International, 176, 113820",
      doi: "https://doi.org/10.1016/J.FOODRES.2023.113820",
      tags: ['Otros']
    },
    {
      id: 60,
      authors: "Garc\u00eda-Mart\u00ednez, E., Camacho, M. del M., & Mart\u00ednez-Navarrete, N",
      year: 2023,
      title: "In Vitro Bioaccessibility of Bioactive Compounds of Freeze-Dried Orange Juice Co-Product Formulated with Gum Arabic and Modified Starch",
      journal: "Molecules, 28(2), 810",
      doi: "https://doi.org/10.3390/molecules28020810",
      tags: ['Otros']
    },
    {
      id: 61,
      authors: "Giler, A",
      year: 2019,
      title: "Caracterizaci\u00f3n de las hojas de remolacha (Beta Vulgaris) liofilizadas para su uso en la elaboraci\u00f3n de infusi\u00f3n [Tesis de pregrado, Universidad Laica Eloy Alfaro de Manab\u00ed]",
      journal: "Unknown",
      doi: "https://repositorio.uleam.edu.ec/handle/123456789/2279",
      tags: ['Otros']
    },
    {
      id: 62,
      authors: "Golding, M., & Wooster, T. J",
      year: 2010,
      title: "The influence of emulsion structure and stability on lipid digestion",
      journal: "Current Opinion in Colloid & Interface Science, 15(1), 90-101",
      doi: "https://doi.org/10.1016/j.cocis.2009.11.006",
      tags: ['Otros']
    },
    {
      id: 63,
      authors: "Gonz\u00e1les-Toxqui, C., Gonz\u00e1les, A., L\u00f3pez, R., & Mendoza-Mu\u00f1oz, I",
      year: 2020,
      title: "Time and energy reduction on grape dehydration by applying dipping solution on freeze drying process",
      journal: "Unknown",
      doi: "https://doi.org/10.1590/0001-3765202020190072",
      tags: ['Otros']
    },
    {
      id: 64,
      authors: "Gonz\u00e1lez, V., Mauriz, C. R., Fero, C. S., Plana, S. V., & Rodr\u00edguez-Moldes, C",
      year: 2014,
      title: "Estudio hed\u00f3nico del pan en el IES Mugardos",
      journal: "Unknown",
      doi: "https://iestpcabana.edu.pe/wp-content/uploads/2021/11/INTRODUCCION-AL-ANALISIS-SENSORIAL.pdf",
      tags: ['Otros']
    },
    {
      id: 65,
      authors: "Gonz\u00e1lez-Castro, Y., Manzano-Dur\u00e1n, O., & Garc\u00eda-Hoya, O",
      year: 2019,
      title: "Puntos cr\u00edticos de la cadena productiva de la mora (Rubus glaucus Benth), en el municipio de Pamplona, Colombia",
      journal: "Revista de Investigaci\u00f3n, Desarrollo e Innovaci\u00f3n, 10(1), 9\u201322",
      doi: "https://doi.org/10.19053/20278306.v10.n1.2019.10008",
      tags: ['Otros']
    },
    {
      id: 66,
      authors: "Grande-Tovar, C. D., Delgado-Ospina, J., Puerta, L. F., Rodr\u00edguez, G. C., Sacchetti, G., Papare...",
      year: 2019,
      title: "Bioactive micro-constituents of ackee arilli (Blighia sapida K",
      journal: "D. Koenig). Anais Da Academia Brasileira de Ci\u00eancias, 91(3), e20180140",
      doi: "https://doi.org/10.1590/0001-3765201920180140",
      tags: ['Otros']
    },
    {
      id: 67,
      authors: "Guerra, A., Etienne-Mesmin, L., Livrelli, V., Sylvain, D., Blanquet-Diot, S., & Alric, M",
      year: 2012,
      title: "Relevance and challenges in modeling human gastric and small intestinal digestion",
      journal: "Trends in Biotechnology, 30(11), 591-600",
      doi: "https://doi.org/10.1016/j.tibtech.2012.08.001",
      tags: ['Otros']
    },
    {
      id: 68,
      authors: "Guti\u00e9rrez Gait\u00e9n, I. Y., Miranda Mart\u00ednez, M., Varona Torres, N., & Rodr\u00edguez, A. T",
      year: 2000,
      title: "Validaci\u00f3n de dos m\u00e9todos espectrofotom\u00e9tricos para la cuantificaci\u00f3n de taninos y flavonoides en (Psidium Guahaba), L",
      journal: "Rev Cubana Farm, 34(1), 50\u201355",
      doi: "http://scielo.sld.cu/scielo.php?script=sci_arttext&pid=S0034-75152000000100007",
      tags: ['Otros']
    },
    {
      id: 69,
      authors: "Guti\u00e9rrez, D. Y. M., Guerra, M. V. T., & Pinz\u00f3n, M. E. T",
      year: 2015,
      title: "Propiedades f\u00edsicas, qu\u00edmicas y mec\u00e1nicas de la pi\u00f1a Golden y Mayan\u00e9s utilizada para la indumentaria en Bogot\u00e1",
      journal: "Teor\u00eda y praxis investigativa, 8(2), 32 - 43",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 70,
      authors: "Guti\u00e9rrez, Rosa Martha P\u00e9rez, Sylvia Mitchell, and Rosario Vargas Solis",
      year: 2008,
      title: "Psidium Guajava: A Review of Its Traditional Uses, Phytochemistry and Pharmacology",
      journal: "Journal of Ethnopharmacology 117(1):1\u201327",
      doi: "doi:10.1016/j.jep.2008.01.025",
      tags: ['Otros']
    },
    {
      id: 71,
      authors: "Guti\u00e9rrez, Y. I., Miranda Mart\u00ednez, M., Varona Torres, N., & Rodr\u00edguez, A. T",
      year: 2000,
      title: "Validaci\u00f3n de 2 m\u00e9todos espectrofotom\u00e9tricos para la cuantificaci\u00f3n de taninos y flavonoides (quercetina) en Psidium guajava",
      journal: "Revista Cubana de Farmacia, 34(1), 50-55",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 72,
      authors: "Hartati, Rika, Fahrani Meisya Rompis, Hegar Pramastya, and Irda Fidrianny",
      year: 2024,
      title: "Optimization of Antioxidant Activity of Soursop (Annona Muricata L.) Leaf Extract Using Response Surface Methodology",
      journal: "Biomedical Reports 21(5):1\u201313",
      doi: "doi:10.3892/BR.2024.1854/ABSTRACT",
      tags: ['Otros']
    },
    {
      id: 73,
      authors: "Hern\u00e1ndez, A. B",
      year: 2020,
      title: "Incorporaci\u00f3n de compuestos bioactivos de muc\u00edlago de cacao (Theobroma cacao L) y pulpa de morti\u00f1o (Vaccinium floribundum kunth.) en el desarrollo de chocolate blanco con prop\u00f3sitos funcionales",
      journal: "[Tesis de pregrado, Universidad T\u00e9cnica Estatal de Quevedo]",
      doi: "https://repositorio.uteq.edu.ec/handle/43000/5953",
      tags: ['Otros']
    },
    {
      id: 74,
      authors: "Hewavitharana, Amitha K., Zhi W. Tan, Ryo Shimada, Paul N. Shaw, and Bernadine M. Flanagan",
      year: 2013,
      title: "Between Fruit Variability of the Bioactive Compounds, \u03b2-Carotene and Mangiferin, in Mango (Mangifera Indica)",
      journal: "Nutrition and Dietetics 70(2):158\u201363",
      doi: "doi:10.1111/1747-0080.12009;JOURNAL:JOURNAL:17470080;ISSUE:ISSUE:DOI",
      tags: ['Otros']
    },
    {
      id: 75,
      authors: "Holst, B., & Williamson, G",
      year: 2008,
      title: "Nutrients and phytochemicals: From bioavailability to bioefficacy beyond antioxidants",
      journal: "Current Opinion in Biotechnology, 19(2), 73-82",
      doi: "https://doi.org/10.1016/j.copbio.2008.03.003",
      tags: ['Otros']
    },
    {
      id: 76,
      authors: "Unknown",
      year: 0,
      title: "",
      journal: "Unknown",
      doi: "https://www.ecuadorencifras.gob.ec/LOTAIP/2017/DIJU/octubre/LA2_OCT_DIJU_Constitucion.pdf",
      tags: ['Otros']
    },
    {
      id: 77,
      authors: "Huerta-Vera, K., Flores-Andrade, E., Contreras-Oliva, A., Villegas-Monter, \u00c1., Chavez-Franco, S...",
      year: 2024,
      title: "Incorporaci\u00f3n de compuestos bioactivos en productos hortofrut\u00edcolas mediante deshidrataci\u00f3n osm\u00f3tica: una revisi\u00f3n",
      journal: "Revista Mexicana de Ciencias Agr\u00edcolas, 14(8), e2936",
      doi: "https://doi.org/10.29312/remexca.v14i8.2936",
      tags: ['Otros']
    },
    {
      id: 78,
      authors: "Ibarra, E. O., & Ram\u00edrez, G. H",
      year: 2021,
      title: "Composici\u00f3n nutricional y compuestos fitoqu\u00edmicos de la pi\u00f1a (Ananas comosus) y su potencial emergente para el desarrollo de alimentos funcionales",
      journal: "Bolet\u00edn de Ciencias Agropecuarias del ICAP, 7(14)",
      doi: "https://doi.org/10.29057/icap.v7i14.7232",
      tags: ['Otros']
    },
    {
      id: 79,
      authors: "INCAP",
      year: 2013,
      title: "Tabla de Composici\u00f3n de Alimentos de Centroam\u00e9rica",
      journal: "INCAP. SE\u00d1 - Sociedad Espa\u00f1ola de Nutrici\u00f3n",
      doi: "https://www.sennutricion.org/es/2013/05/01/tabla-de-composicin-de-alimentos-de-centroamrica-incap",
      tags: ['Otros']
    },
    {
      id: 80,
      authors: "INIAP",
      year: 2009,
      title: "Instituto nacional aut\u00f3nomo de investigaciones agropecuarias estaci\u00f3n experimental central de la Amazon\u00eda Denaref-unidad de recursos fitogen\u00e9ticos INIAP-Estaci\u00f3n Experimental Central Amaz\u00f3nica",
      journal: "Unknown",
      doi: "https://repositorio.iniap.gob.ec/bitstream/41000/4786/7/iniapeecam76.pdf",
      tags: ['Otros']
    },
    {
      id: 81,
      authors: "INIAP",
      year: 2014,
      title: "Guan\u00e1bana",
      journal: "Unknown",
      doi: "https://tecnologia.iniap.gob.ec/guanabana/",
      tags: ['Otros']
    },
    {
      id: 82,
      authors: "Iombor, T. T., Olaitan, I. N., & Ede, R. A",
      year: 2014,
      title: "Proximate Composition, Antinutrient Content and Functional Properties of Soursop Flour as Influenced by Oven and Freeze Drying Methods",
      journal: "Current Research in Nutrition and Food Science Journal, 2(2), 106-110",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 83,
      authors: "Jainu, Mallika, and C. S. Shyamala Devi",
      year: 2005,
      title: "In Vitro and in Vivo Evaluation of Free-Radical Scavenging Potential of Cissus Quadrangularis",
      journal: "Pharmaceutical Biology 43(9):773\u201379",
      doi: "doi:10.1080/13880200500406636",
      tags: ['Otros']
    },
    {
      id: 84,
      authors: "Jim\u00e9nez, C. A., Quesada, C. A., & Z\u00fa\u00f1iga, K. S",
      year: 2013,
      title: "Prueba sensorial de grado de satisfacci\u00f3n para una ensalada y un dip tipo hummus elaborados a base de gandul (Cajanus cajan (L",
      journal: ") Mill sp.). Repertorio Cient\u00edfico, 16(2), 3\u201325",
      doi: "https://doi.org/10.22458/rc.v16i2.2499",
      tags: ['Otros']
    },
    {
      id: 85,
      authors: "Jim\u00e9nez-Monreal, A. M., Cede\u00f1o-Pinos, C., Ba\u00f1\u00f3n, S., Mu\u00f1oz, I., Guardia, M. D., Tahori, N., & M...",
      year: 2025,
      title: "Effect of in vitro gastrointestinal digestion on the antioxidant properties of fruit and vegetable powdered smoothies reinforced with WPC80",
      journal: "LWT, 215, 117301",
      doi: "https://doi.org/10.1016/j.lwt.2024.117301",
      tags: ['Otros']
    },
    {
      id: 86,
      authors: "Kalantzi, L., Goumas, K., Kalioras, V., Abrahamsson, B., Dressman, J. B., & Reppas, C",
      year: 2006,
      title: "Characterization of the Human Upper Gastrointestinal Contents Under Conditions Simulating Bioavailability/Bioequivalence Studies",
      journal: "Pharmaceutical Research, 23(1), 165-176",
      doi: "https://doi.org/10.1007/s11095-005-8476-1",
      tags: ['Otros']
    },
    {
      id: 87,
      authors: "Lacerda, L. D., Cavalcante, I. B. K., Soares, A. A., & Marins, R. V",
      year: 2024,
      title: "Mobility, bioavailability and distribution of Fe and Cu in mangroves (Avicennia schaueriana and Rhizophora mangle) from a semiarid coast in NE Brazil",
      journal: "Anais Da Academia Brasileira de Ci\u00eancias, 96(2), e20231075",
      doi: "https://doi.org/10.1590/0001-3765202420231075",
      tags: ['Otros']
    },
    {
      id: 88,
      authors: "Lech\u00f3n, L. Z",
      year: 2022,
      title: "Estudio del comportamiento de las caracter\u00edsticas f\u00edsico-qu\u00edmicas de la uvilla (Physalis peruviana L",
      journal: ") contenido de polifenoles y capacidad antioxidante en atm\u00f3sferas modificadas y refrigeraci\u00f3n. [Tesis de pregrado, Universidad T\u00e9cnica del Norte]",
      doi: "https://repositorio.utn.edu.ec/handle/123456789/12486",
      tags: ['Otros']
    },
    {
      id: 89,
      authors: "Le\u00f3n-Fern\u00e1ndez, A. E., Morales, R. B., Bautista-Rosales, P. U., Palomino-Hermosillo, Y. A., Bel...",
      year: 2021,
      title: "Extracci\u00f3n de compuestos fitoqu\u00edmicos de inflorescencia y frutos de guan\u00e1bana (Annona muricata L",
      journal: "). Acta Agr\u00edcola y Pecuaria, 7(1)",
      doi: "https://aap.uaem.mx/index.php/aap/article/view/269",
      tags: ['Otros']
    },
    {
      id: 90,
      authors: "Ley Org\u00e1nica de Salud",
      year: 2006,
      title: "Ley Org\u00e1nica de salud",
      journal: "www.lexis.com.ec",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 91,
      authors: "Ley Org\u00e1nica del R\u00e9gimen de la Soberan\u00eda Alimentaria",
      year: 2009,
      title: "Ley Org\u00e1nica del R\u00e9gimen de la Soberan\u00eda Alimentaria",
      journal: "Unknown",
      doi: "https://www.gob.ec/sites/default/files/regulations/2019-04/ley%20org%c3%81nica%20del%20r%c3%89gimen%20de%20la%20soberan%c3%8da%20alimentaria%20-%20lorsa.pdf",
      tags: ['Otros']
    },
    {
      id: 92,
      authors: "Li, N., Taylor, L. S., & Mauer, L. J",
      year: 2011,
      title: "Degradation Kinetics of Catechins in Green Tea Powder: Effects of Temperature and Relative Humidity",
      journal: "Journal of Agricultural and Food Chemistry, 59(11), 6082\u20136090",
      doi: "https://doi.org/10.1021/JF200203N",
      tags: ['Otros']
    },
    {
      id: 93,
      authors: "Lima, Giulia Vict\u00f3ria Silva, F\u00e1bio Gomes Moura, S\u00e9bastien Gofflot, Anne Suellen Oliveira Pinto,...",
      year: 0,
      title: "2025b. \u201cTargeted Metabolomics for Quantitative Assessment of Polyphenols and Methylxanthines in Fermented and Unfermented Cocoa Beans from 18 Genotypes of the Brazilian Amazon.\u201d Food Research International 211:116394.",
      journal: "Unknown",
      doi: "doi:10.1016/J.FOODRES.2025.116394",
      tags: ['Otros']
    },
    {
      id: 94,
      authors: "Lima, Giulia Vict\u00f3ria Silva, F\u00e1bio Gomes Moura, S\u00e9bastien Gofflot, Anne Suellen Oliveira Pinto,...",
      year: 0,
      title: "2025a. \u201cTargeted Metabolomics for Quantitative Assessment of Polyphenols and Methylxanthines in Fermented and Unfermented Cocoa Beans from 18 Genotypes of the Brazilian Amazon.\u201d Food Research International 211(March).",
      journal: "Unknown",
      doi: "doi:10.1016/j.foodres.2025.116394",
      tags: ['Otros']
    },
    {
      id: 95,
      authors: "Lopa, J., Valderrama, M., Le\u00f3n, N., Lazo, L., Llerena, J. P., Ball\u00f3n, C., & Guija-Poma, E",
      year: 2021,
      title: "Evaluaci\u00f3n de la capacidad antioxidante y compuestos bioactivos de tumbo (Passiflora mollissima) y cerezo (Prunus serotina)",
      journal: "Horizonte M\u00e9dico (Lima), 21(3), e1365",
      doi: "https://doi.org/10.24265/horizmed.2021.v21n3.08",
      tags: ['Otros']
    },
    {
      id: 96,
      authors: "Lou, X., Guo, X., Wang, K., Wu, C., Jin, Y., Lin, Y., Xu, H., Hanna, M., & Yuan, L",
      year: 2021,
      title: "Phenolic profiles and antioxidant activity of Crataegus pinnatifida fruit infusion and decoction and influence of in vitro gastrointestinal digestion on their digestive recovery",
      journal: "LWT, 135, 110171",
      doi: "https://doi.org/10.1016/j.lwt.2020.110171",
      tags: ['Otros']
    },
    {
      id: 97,
      authors: "Lutz, Mariane, Jos\u00e9 Hern\u00e1ndez, and Carolina Henr\u00edquez",
      year: 2015,
      title: "Phenolic Content and Antioxidant Capacity in Fresh and Dry Fruits and Vegetables Grown in Chile",
      journal: "CYTA - Journal of Food 13(4):541\u201347",
      doi: "doi:10.1080/19476337.2015.1012743",
      tags: ['Otros']
    },
    {
      id: 98,
      authors: "Maldonado C, M. E., Franco L, M. C., & Urango M, L. A",
      year: 2015,
      title: "Biotecnolog\u00eda en el sector agropecuario y agroindustrial",
      journal: "In Biotecnolog\u00eda en el Sector Agropecuario y Agroindustrial (Vol. 13, Issue 1). Universidad del Cauca, Vicerrectoria de Investigaciones",
      doi: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S1692-35612015000100014&lng=en&nrm=iso&tlng=",
      tags: ['Otros']
    },
    {
      id: 99,
      authors: "M\u00e1rquez-Villacorta, L., Pretell-V\u00e1squez, C., & Hayayumi-Valdivia, M",
      year: 2021,
      title: "Functional beverage design based on fresh milk, tarwi (Lupinus mutabilis) beverage and oatmeal (Avena sativa)",
      journal: "Revista Chilena de Nutrici\u00f3n, 48(4), 490\u2013499",
      doi: "https://doi.org/10.4067/S0717-75182021000400490",
      tags: ['Otros']
    },
    {
      id: 100,
      authors: "Mart\u00ednez-Navarrete, N., del Mar Camacho Vidal, M., & Jos\u00e9 Mart\u00ednez Lahuerta, J",
      year: 2008,
      title: "Los compuestos bioactivos de las frutas y sus efectos en la salud",
      journal: "Actividad Diet\u00e9tica, 12(2), 64-68",
      doi: "https://doi.org/10.1016/S1138-0322(08)75623-2",
      tags: ['Otros']
    },
    {
      id: 101,
      authors: "Meilgaard, M. C., Thomas, B., & Thomas, C",
      year: 2007,
      title: "T\u00e9cnicas de evaluaci\u00f3n sensorial",
      journal: "Unknown",
      doi: "https://doi.org/10.1201/b16452",
      tags: ['Otros']
    },
    {
      id: 102,
      authors: "Meza, N., & Manzano M\u00e9ndez, J",
      year: 2009,
      title: "Caracter\u00edsticas del fruto de tomate de \u00e1rbol (Cyphomandra betacea (Cav",
      journal: ") Sendtn) basadas en la coloraci\u00f3n del arilo, en la Zona Andina Venezolana. Revista Cient\u00edfica UDO Agr\u00edcola, 9(2), 289-294",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 103,
      authors: "Mohammed, C., Hamad, W., & Mohammed, E. K",
      year: 2009,
      title: "Spectrophotometric Determination of Total Vitamin C in Some Fruits and Vegetables at Koya Area \u2013 Kurdistan Region/ Iraq",
      journal: "Kirkuk Journal of Science, 4(2), 46-54",
      doi: "https://doi.org/10.32894/kujss.2009.39913",
      tags: ['Otros']
    },
    {
      id: 104,
      authors: "Monz\u00f3n Daza, Gabriel, Carolina Meneses Mac\u00edas, Abel M. Forero, Jaime Rodr\u00edguez, Marcela Arag\u00f3n,...",
      year: 2021,
      title: "Identification of \u0391-Amylase and \u0391-Glucosidase and Ligularoside A, a New Triterpenoid Saponin from Passiflora Ligularis Juss (Sweet Granadilla) Leaves, by a Nuclear Magnetic Resonance-Based Metabolomic Study",
      journal: "Journal of Agricultural and Food Chemistry 69(9):2919\u201331",
      doi: "doi:10.1021/ACS.JAFC.0C07850",
      tags: ['Otros']
    },
    {
      id: 105,
      authors: "Moraes, Fagundes, M., Biasi, A., Brasil, M., Tofanelli, D., Paula, A., Rodrigues, S., & Tonetto...",
      year: 2023,
      title: "Production, quality, bioactive compounds, and phenology of raspberry",
      journal: "Sci. Agric. v, 81, 2024",
      doi: "https://doi.org/10.1590/1678-992X-2023-0009",
      tags: ['Otros']
    },
    {
      id: 106,
      authors: "Moraes, L. R. V., Azevedo, L. C. de, Santos, V. M. L., & Leit\u00e3o, T. J. V",
      year: 2012,
      title: "Estudo comparativo da desidrata\u00e7\u00e3o de frutas para fins de infus\u00e3o, por m\u00e9todo tradicional e liofiliza\u00e7\u00e3o",
      journal: "Revista Semi\u00e1rido De Visu, 2(2), 254\u2013264",
      doi: "https://doi.org/10.31416/RSDV.V2I2.183",
      tags: ['Otros']
    },
    {
      id: 107,
      authors: "Moreno, C., & Basanta, E",
      year: 2019,
      title: "El Manual del Cultivo de Uvilla",
      journal: "(Fundaci\u00f3n Humana Pueblo a Pueblo Ecuador y Fundaci\u00f3n Mujeres)",
      doi: "https://humana-ecuador.org/wp-content/uploads/2021/09/Manual-de-Uvilla_Final.pdf",
      tags: ['Otros']
    },
    {
      id: 108,
      authors: "Moreno-Guerrero, C., Andrade-Cuvi, M., Concell\u00f3n, A., & D\u00edaz-Navarrete, G",
      year: 2013,
      title: "Estudio de la capacidad antioxidante durante el almacenamiento refrigerado de naranjilla (solanum quitoense) tratada con radiaci\u00f3n uv-c",
      journal: "Unknown",
      doi: "http://ve.scielo.org/scielo.php?script=sci_abstract&pid=S0004-06222009000100014&lng=en&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 109,
      authors: "Moreno-Miranda, C., Moreno-Miranda, R., Pilamala-Rosales, A. A., Molina-S\u00e1nchez, J. I., & Cerda...",
      year: 2019,
      title: "sector hortofrut\u00edcola de Ecuador: Principales caracter\u00edsticas socio-productivas de la red agroalimentaria de la uvilla (Physalis peruviana)",
      journal: "Ciencia y Agricultura, 16(1), 31\u201351",
      doi: "https://doi.org/10.19053/01228420.V16.N1.2019.8809",
      tags: ['Otros']
    },
    {
      id: 110,
      authors: "Mosquera, L. H., Moraga, G., & Mart\u00ednez-Navarrete, N",
      year: 2010,
      title: "Effect of maltodextrin on the stability of freeze-dried boroj\u00f3 (Borojoa patinoi Cuatrec",
      journal: ") powder. Journal of Food Engineering, 97(1), 72\u201378",
      doi: "https://doi.org/10.1016/J.JFOODENG.2009.09.017",
      tags: ['Otros']
    },
    {
      id: 111,
      authors: "Mu\u00f1oz, P., Parra, F., Simirgiotis, M. J., Sep\u00falveda Chavera, G. F., & Parra, C",
      year: 2021,
      title: "Chemical Characterization, Nutritional and Bioactive Properties of Physalis peruviana Fruit from High Areas of the Atacama Desert",
      journal: "Foods, 10(11)",
      doi: "https://doi.org/10.3390/foods10112699",
      tags: ['Otros']
    },
    {
      id: 112,
      authors: "Mu\u00f1oz-Fari\u00f1a, O., L\u00f3pez-Casanova, V., Garc\u00eda-Figueroa, O., Roman-Benn, A., Ah-Hen, K., Bastias-...",
      year: 2023,
      title: "Bioaccessibility of phenolic compounds in fresh and dehydrated blueberries (Vaccinium corymbosum L",
      journal: "). Food Chemistry Advances, 2, 100171",
      doi: "https://doi.org/10.1016/J.FOCHA.2022.100171",
      tags: ['Otros']
    },
    {
      id: 113,
      authors: "Mu\u00f1oz-L\u00f3pez, C., Urrea-Garc\u00eda, G. R., Jim\u00e9nez-Fern\u00e1ndez, M., Rodr\u00edguez-Jim\u00e9nes, G. del C., & Lu...",
      year: 2018,
      title: "Effect of freeze-drying conditions on the physicochemical Properties, pectin content, and rehydration capacity of plum slices (Spondias purpurea L",
      journal: "). Agrociencia, 52(1), 1-13",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 114,
      authors: "Navarro-Gonz\u00e1lez, I., & Periago, M. J",
      year: 2016,
      title: "El tomate, \u00bfalimento saludable y/o funcional? Revista Espa\u00f1ola de Nutrici\u00f3n Humana y Diet\u00e9tica, 20(4), 323\u2013335",
      journal: "Unknown",
      doi: "https://doi.org/10.14306/renhyd.20.4.208",
      tags: ['Otros']
    },
    {
      id: 115,
      authors: "Nayak, P. K., Sundarsingh, A., & Kesavan, R. krishnan",
      year: 2022,
      title: "In vitro gastrointestinal digestion studies on total phenols, flavonoids, anti-oxidant activity and vitamin C in freeze-dried vegetable powders",
      journal: "Journal of Food Science and Technology, 59(11), 4253-4261",
      doi: "https://doi.org/10.1007/s13197-022-05488-z",
      tags: ['Otros']
    },
    {
      id: 116,
      authors: "Nursanty, R",
      year: 0,
      title: ", Naim Bin Kairhul, Anah Nurk, Ainy, N., Haniff, A., & Rukayadi, Y. (2023, May 19). View of Phytochemical analysis of ethanolic Psidium guajava leaves extract using GC-MS and LC-MS.",
      journal: "Unknown",
      doi: "https://smujo.id/biodiv/article/view/14347/6811",
      tags: ['Otros']
    },
    {
      id: 117,
      authors: "OMS & FAO (Eds.)",
      year: 2003,
      title: "Diet, nutrition, and the prevention of chronic diseases: Report of a WHO-FAO Expert Consultation\u202f; [Joint WHO-FAO Expert Consultation on Diet, Nutrition, and the Prevention of Chronic Diseases, 2002, Geneva, Switzerland]",
      journal: "Expert Consultation on Diet, Nutrition, and the Prevention of Chronic Diseases, Geneva. World Health Organization",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 118,
      authors: "Oney Montalvo, J",
      year: 0,
      title: "E., Cabal Prieto, A., & Ram\u00edrez Rivera, E. de J. (2023, June). Vista de La pitahaya (Hylocereus spp.) como alimento funcional: fuente de nutrientes y fitoqu\u00edmicos.",
      journal: "Unknown",
      doi: "http://www.milenaria.umich.mx/ojs/index.php/milenaria/article/view/342/171",
      tags: ['Otros']
    },
    {
      id: 119,
      authors: "Oracz, J., Kr\u00f3lak, K., Kordialik-Bogacka, E., & \u017by\u017celewicz, D",
      year: 2025,
      title: "Optimizing brewing conditions for low-temperature green tea infusions: Insights into functional and nutritional properties",
      journal: "Food Chemistry, 474, 143241",
      doi: "https://doi.org/10.1016/J.FOODCHEM.2025.143241",
      tags: ['Otros']
    },
    {
      id: 120,
      authors: "Osorio-Oviedo, \u00c1. A",
      year: 2019,
      title: "Pruebas de an\u00e1lisis sensorial para el desarrollo de productos de cereales infantiles en Venezuela Sensory analysis tests for the development of infant cereal products in Venezuela",
      journal: "Publicaciones En Ciencias y Tecnolog\u00eda, 13, 27\u201337",
      doi: "https://doi.org/10.13140/RG.2.2.21791.51361",
      tags: ['Otros']
    },
    {
      id: 121,
      authors: "Paz, R. J. S., Gonzales, G. N. P., & Sota, A. E",
      year: 2021,
      title: "Comparaci\u00f3n de m\u00e9todos sensoriales descriptivos: Perfil flash y preguntas CATA para caracterizar infusiones de mu\u00f1a (Minthostachys mollis)",
      journal: "Enfoque UTE, 12(3), 11-23",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 122,
      authors: "Pedersen, A., Bardow, A., Jensen, S. B., & Nauntofte, B",
      year: 2002,
      title: "Saliva and gastrointestinal functions of taste, mastication, swallowing and digestion",
      journal: "Oral Diseases, 8(3), 117-129",
      doi: "https://doi.org/10.1034/j.1601-0825.2002.02851.x",
      tags: ['Otros']
    },
    {
      id: 123,
      authors: "Pellegrini, M., Lucas-Gonzalez, R., Fern\u00e1ndez-L\u00f3pez, J., Ricci, A., P\u00e9rez-\u00c1lvarez, J. A., Sterz...",
      year: 2017,
      title: "Bioaccessibility of polyphenolic compounds of six quinoa seeds during in vitro gastrointestinal digestion",
      journal: "Journal of Functional Foods, 38, 77\u201388",
      doi: "https://doi.org/10.1016/J.JFF.2017.08.042",
      tags: ['Otros']
    },
    {
      id: 124,
      authors: "P\u00e9rez-Perez, L. M., Toro S\u00e1nchez, C. L. Del, S\u00e1nchez Chavez, E., Gonz\u00e1lez Vega, R. I., Reyes D\u00ed...",
      year: 2020,
      title: "Bioaccesibilidad de compuestos antioxidantes de diferentes variedades de frijol (Phaseolus vulgaris L",
      journal: ") en M\u00e9xico, mediante un sistema gastrointestinal in vitro. Biotecnia, 22(1), 117\u2013125",
      doi: "https://doi.org/10.18633/BIOTECNIA.V22I1.1159",
      tags: ['Otros']
    },
    {
      id: 125,
      authors: "Pino Q., M. T., Dom\u00ednguez D., E., & Saavedra, J",
      year: 2018,
      title: "*Protocolos estandarizados para la valorizaci\u00f3n de frutos nativos del PROCISUR frente a la creciente demanda por ingredientes y aditivos especializados (Carotenoides, Antocianinas y Polifenoles) *",
      journal: "Unknown",
      doi: "https://biblioteca.inia.cl/handle/20.500.14001/63093",
      tags: ['Otros']
    },
    {
      id: 126,
      authors: "Pizan Cisneros, A. K., Huamani Cuevas, O. K., Chuquipoma Silva, D., Silva, B. E. C., & Mu\u00f1oz So...",
      year: 2023,
      title: "Sensory acceptability of an infusion of Hibiscus Rosa-sinensis, Mentha piperita L",
      journal: "and Citrus sinensis peel",
      doi: "https://doi.org/10.18687/LACCEI2023.1.1.125",
      tags: ['Otros']
    },
    {
      id: 127,
      authors: "Qie, X., Cheng, Y., Chen, Y., Zeng, M., Wang, Z., Qin, F., Chen, J., Li, W., & He, Z",
      year: 2022,
      title: "In vitro phenolic bioaccessibility of coffee beverages with milk and soy subjected to thermal treatment and protein\u2013phenolic interactions",
      journal: "Food Chemistry, 375, 131644",
      doi: "https://doi.org/10.1016/J.FOODCHEM.2021.131644",
      tags: ['Otros']
    },
    {
      id: 128,
      authors: "Quintero Rodr\u00edguez, M. P., Montoya Arango, D., Restrepo Posada, D. C., & Gonz\u00e1lez Gil, D. M",
      year: 2023,
      title: "Conservaci\u00f3n de bacterias por liofilizaci\u00f3n en la Colecci\u00f3n de Microorganismos CM-EM-UDEA, Medell\u00edn, Colombia",
      journal: "Biota Colombiana, 24(2), e1127",
      doi: "https://doi.org/10.21068/2539200X.1127",
      tags: ['Otros']
    },
    {
      id: 129,
      authors: "Repo de Carrasco, R., & Encina, C. R",
      year: 2008,
      title: "Determinaci\u00f3n de la capacidad antioxidante y compuestos bioactivos de frutas nativas peruanas",
      journal: "Revista de la Sociedad Qu\u00edmica del Per\u00fa, 74(2), 108-124",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 130,
      authors: "Rey, Diana P., Sandra M. Echeverry, Ivonne H. Valderrama, Ingrid A. Rodriguez, Luis F. Ospina, ...",
      year: 2024,
      title: "Antidiabetic Effect of Passiflora Ligularis Leaves in High Fat-Diet/Streptozotocin-Induced Diabetic Mice",
      journal: "Nutrients 2024, Vol. 16, Page 1669 16(11):1669",
      doi: "doi:10.3390/NU16111669",
      tags: ['Otros']
    },
    {
      id: 131,
      authors: "Rios-Aguirre, S., & Gil-Garz\u00f3n, M. A",
      year: 2021,
      title: "Microencapsulaci\u00f3n por secado por aspersi\u00f3n de compuestos bioactivos en diversas matrices: una revisi\u00f3n",
      journal: "TecnoL\u00f3gicas, 24(51), e1836",
      doi: "https://doi.org/10.22430/22565337.1836",
      tags: ['Otros']
    },
    {
      id: 132,
      authors: "Rodrigues, D. B., Marques, M. C., Hacke, A., Loubet Filho, P. S., Cazarin, C. B. B., & Mariutti...",
      year: 2022,
      title: "Trust your gut: Bioavailability and bioaccessibility of dietary compounds",
      journal: "Current Research in Food Science, 5, 228-233",
      doi: "https://doi.org/10.1016/j.crfs.2022.01.002",
      tags: ['Otros']
    },
    {
      id: 133,
      authors: "Rodr\u00edguez Leyton, M",
      year: 2019,
      title: "Desaf\u00edos para el consumo de frutas y verduras",
      journal: "Revista de La Facultad de Medicina Humana, 19(2), 105\u2013112",
      doi: "https://doi.org/10.25176/RFMH.v19.n2.2077",
      tags: ['Otros']
    },
    {
      id: 134,
      authors: "Rodr\u00edguez, M. A., Barrag\u00e1n-V\u00e1zquez, F. J., V\u00e1zquez-Vuelvas, O. F., Mu\u00f1iz-Valencia, R., & Ceball...",
      year: 2020,
      title: "Liofilizaci\u00f3n de pulpa de guan\u00e1bana (Annona muricata L",
      journal: ") y su evaluaci\u00f3n fisicoqu\u00edmica, microbiol\u00f3gica y sensorial. 5",
      doi: "",
      tags: ['Otros']
    },
    {
      id: 135,
      authors: "Rodr\u00edguez-Basso, Angeles Gloria, H\u00e9ctor Juan Prado, Mar\u00eda Cristina Matulewicz, Karen Perelmuter...",
      year: 2026,
      title: "Chemical Profile and In Vitro Protective Effects of Minthostachys Verticillata (Griseb.) Epling Aqueous Extract in Intestinal Inflammatory Environments",
      journal: "Plants 15(1):1\u201318",
      doi: "doi:10.3390/plants15010069",
      tags: ['Otros']
    },
    {
      id: 136,
      authors: "Romagosa-Ibieta, S., Vald\u00e9s-Mar\u00edn, M., Duarte-Garc\u00eda, C., Hern\u00e1ndez-Monz\u00f3n, A., & Rodr\u00edguez-Vil...",
      year: 2021,
      title: "Evaluaci\u00f3n de la calidad sensorial y la aceptabilidad de diferentes productos alimenticios elaborados con adici\u00f3n de jugo de s\u00e1bila (Aloe vera) y su relaci\u00f3n con la dosis empleada",
      journal: "In Tecnolog\u00eda Qu\u00edmica (Vol. 41, Issue 3). Direcci\u00f3n de Informaci\u00f3n Cient\u00edfico-T\u00e9cnica, Universidad de Oriente",
      doi: "http://scielo.sld.cu/scielo.php?script=sci_arttext&pid=S2224-61852021000300480&lng=es&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 137,
      authors: "Salas, F., Vejarano, R., & Bo\u00f1\u00f3n, C",
      year: 2020,
      title: "Efecto del secado por t\u00fanel, liofilizaci\u00f3n y atomizaci\u00f3n sobre la capacidad antioxidante y compuestos fen\u00f3licos de huacatay",
      journal: "Unknown",
      doi: "https://doi.org/10.18687/LACCEI2020.1.1.223",
      tags: ['Otros']
    },
    {
      id: 138,
      authors: "Sanlier, Nevin, Esra Irmak, and Erva Ankarali",
      year: 2026,
      title: "Potential Health Benefits of Bromelain: A Critical Review of the Current Literature",
      journal: "Frontiers in Nutrition 13:1744666",
      doi: "doi:10.3389/FNUT.2026.1744666/FULL",
      tags: ['Otros']
    },
    {
      id: 139,
      authors: "Scharf, Raissa Miranda, Carine Oliveira Gon\u00e7alves, Andreia da Silva Fernandes, Jos\u00e9 Luiz Mazzei...",
      year: 2024,
      title: "Antimutagenic and Antitumor Activities of a Water-Soluble Fraction of Soursop (Syn Graviola, Annona Muricata L.) Fruit Pulp",
      journal: "Journal of Toxicology and Environmental Health. Part A 87(7):310\u201324",
      doi: "doi:10.1080/15287394.2024.2309335",
      tags: ['Otros']
    },
    {
      id: 140,
      authors: "Shahidi, F., Liyana-Pathirana, C. M., & Wall, D. S",
      year: 2006,
      title: "Antioxidant activity of white and black sesame seeds and their hull fractions",
      journal: "Food Chemistry, 99(3), 478-483",
      doi: "https://doi.org/10.1016/j.foodchem.2005.08.009",
      tags: ['Otros']
    },
    {
      id: 141,
      authors: "Silva, D. R., & Nunez, C. V",
      year: 2024,
      title: "Flavonoides e \u00e1cidos fen\u00f3licos isolados dos extratos metan\u00f3licos das folhas e galhos de Macrolobium acaciifolium (FABACEAE)",
      journal: "Qu\u00edmica Nova, 47(7), e-20240040",
      doi: "https://doi.org/10.21577/0100-4042.20240040",
      tags: ['Otros']
    },
    {
      id: 142,
      authors: "Silva, Larissa Marina Pereira, Jovelina Samara Ferreira Alves, Emerson Michell Da Silva Siqueir...",
      year: 2018,
      title: "Isolation and Identification of the Five Novel Flavonoids from Genipa Americana Leaves",
      journal: "Molecules 23(10):1\u201313",
      doi: "doi:10.3390/molecules23102521",
      tags: ['Otros']
    },
    {
      id: 143,
      authors: "Smith, M. E., & Morton, D. G",
      year: 2010,
      title: "Overview of the digestive system",
      journal: "En M. E. Smith & D. G. Morton (Eds.), The Digestive System (Second Edition) (pp. 1-18). Churchill Livingstone",
      doi: "https://doi.org/10.1016/B978-0-7020-3367-4.00001-3",
      tags: ['Otros']
    },
    {
      id: 144,
      authors: "Sotelo, I., Casas, N., & Camelo, G",
      year: 2010,
      title: "Boroj\u00f3 (Borojoa patinoi): Fuente de polifenoles con actividad antimicrobiana",
      journal: "In Vitae (Vol. 17, Issue 3). Facultad De Qu\u00edmica Farmac\u00e9utica, Universidad de Antioquia",
      doi: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S0121-40042010000300011&lng=en&nrm=iso&tlng=es",
      tags: ['Otros']
    },
    {
      id: 145,
      authors: "Su\u00e1rez-Toledo, J. R., Hern\u00e1ndez-Aguilar, C., Dom\u00ednguez-Pacheco, F. A., Aceves-Hernandez, F. J.,...",
      year: 2022,
      title: "Caracterizaci\u00f3n de la guayaba cultivada en M\u00e9xico",
      journal: "Revista Mexicana de Ciencias Agr\u00edcolas, 13(7), 1233\u20131245",
      doi: "https://doi.org/10.29312/remexca.v13i7.3039",
      tags: ['Otros']
    },
    {
      id: 146,
      authors: "Surco, J. A., & Alvarado Kirigin, J. A",
      year: 2011,
      title: "Estudio estad\u00edstico de pruebas sensoriales de harinas compuestas para panificaci\u00f3n",
      journal: "A\u00f1o",
      doi: "http://www.bolivianchemistryjournal.org,http://www.scielo.org,http://www.scribd.com/bolivianjournalofchemistry",
      tags: ['Otros']
    },
    {
      id: 147,
      authors: "Tagliazucchi, D., Verzelloni, E., Bertolini, D., & Conte, A",
      year: 2010,
      title: "In vitro bio-accessibility and antioxidant activity of grape polyphenols",
      journal: "Food Chemistry, 120(2), 599-606",
      doi: "https://doi.org/10.1016/j.foodchem.2009.10.030",
      tags: ['Otros']
    },
    {
      id: 148,
      authors: "Teixeira, M., De Luca, L., Faria, A., Bordiga, M., de Freitas, V., Mateus, N., & Oliveira, H",
      year: 2024,
      title: "First Insights on the Bioaccessibility and Absorption of Anthocyanins from Edible Flowers: Wild Pansy, Cosmos, and Cornflower",
      journal: "Pharmaceuticals 2024, Vol. 17, Page 191, 17(2), 191",
      doi: "https://doi.org/10.3390/PH17020191",
      tags: ['Otros']
    },
    {
      id: 149,
      authors: "Tequin-Ocampo, Elsa B., Clara H. Gonz\u00e1lez-Correa, Juan P. Restrepo-L\u00f3pez, Arist\u00f3feles Ortiz, an...",
      year: 2026,
      title: "Physicochemical Characteristics and Antioxidant Capacity of Total Phenolic Compounds in Colombian Passiflora Ligularis Juss",
      journal: "Discover Food 2026 6:1 6(1):73-",
      doi: "doi:10.1007/S44187-026-00821-3",
      tags: ['Otros']
    },
    {
      id: 150,
      authors: "Trulls, H. E., Ortiz, M. L., Picot, J. A., Zach, A., & Brem, J. C",
      year: 2023,
      title: "Bioaccesibilidad in vitro y concentraciones totales de minerales esenciales en carne de dorado (Salminus brasiliensis) crudo y cocido",
      journal: "Revista Veterinaria, 34(2), 111\u2013116",
      doi: "https://doi.org/10.30972/VET.3427053",
      tags: ['Otros']
    },
    {
      id: 151,
      authors: "U\u011fur, H., \u00c7atak, J., M\u0131zrak, \u00d6. F., \u00c7ebi, N., & Yaman, M",
      year: 2020,
      title: "Determination and evaluation of in vitro bioaccessibility of added vitamin C in commercially available fruit-, vegetable-, and cereal-based baby foods",
      journal: "Food Chemistry, 330, 127166",
      doi: "https://doi.org/10.1016/J.FOODCHEM.2020.127166",
      tags: ['Otros']
    },
    {
      id: 152,
      authors: "Valenzuela, A",
      year: 2004,
      title: "El consumo t\u00e9 y la salud: Caracter\u00edsticas y propiedades ben\u00e9ficas de esta bebida milenaria",
      journal: "Revista chilena de nutrici\u00f3n, 31(2), 72-82",
      doi: "https://doi.org/10.4067/S0717-75182004000200001",
      tags: ['Otros']
    },
    {
      id: 153,
      authors: "Valerio de Mello Braga, Lara Luisa, Carolina Silva Schiebel, Gisele Sim\u00e3o, Karien Sauruk da Sil...",
      year: 2025,
      title: "Type I Arabinogalactan and Methyl-Esterified Homogalacturonan Polysaccharides from Tamarillo (Solanum Betaceum Cav.) Fruit Pulp Ameliorate DSS-Induced Ulcerative Colitis",
      journal: "Pharmaceuticals 2025, Vol. 18, Page 461 18(4):461",
      doi: "doi:10.3390/PH18040461",
      tags: ['Otros']
    },
    {
      id: 154,
      authors: "Velderrain-Rodr\u00edguez, G. R., Palafox-Carlos, H., Wall-Medrano, A., Ayala-Zavala, J. F., Chen, C...",
      year: 2014,
      title: "Phenolic compounds: Their journey after intake",
      journal: "Food & Function, 5(2), 189-197",
      doi: "https://doi.org/10.1039/c3fo60361j",
      tags: ['Otros']
    },
    {
      id: 155,
      authors: "Verhoeckx, K., Cotter, P., L\u00f3pez-Exp\u00f3sito, I., Kleiveland, C., Lea, T., Mackie, A., Requena, T....",
      year: 2015,
      title: "The Impact of Food Bioactives on Health: In vitro and ex vivo models",
      journal: "Springer",
      doi: "http://www.ncbi.nlm.nih.gov/books/NBK500148/",
      tags: ['Otros']
    },
    {
      id: 156,
      authors: "Verona-Ruiz, A., Urcia-Cerna, J., & Paucar-Menacho, L",
      year: 2020,
      title: "Pitahaya (Hylocereus spp",
      journal: "): Culture, physicochemical characteristics, nutritional composition, and bioactive compounds. Scientia Agropecuaria, 11(3), 439\u2013453",
      doi: "https://doi.org/10.17268/sci.agropecu.2020.03.16",
      tags: ['Otros']
    },
    {
      id: 157,
      authors: "Victoria-Campos, C. I., Ornelas-Paz, J., Ruiz-Cruz, S., Ornelas-Paz, J. de J., Cervantes-Paz, B...",
      year: 2023,
      title: "Dietary sources, bioavailability and health effects of carotenoids",
      journal: "Biotecnia, 25(1), 156\u2013168",
      doi: "https://doi.org/10.18633/BIOTECNIA.V25I1.1809",
      tags: ['Otros']
    },
    {
      id: 158,
      authors: "Villa-Rivera, M. G., & Ochoa-Alejo, N",
      year: 2023,
      title: "Ascorbic Acid in Chili Pepper Fruits: Biosynthesis, Accumulation, and Factors Affecting its Content",
      journal: "Journal of the Mexican Chemical Society, 67(3), 187\u2013199",
      doi: "https://doi.org/10.29356/JMCS.V67I3.2003",
      tags: ['Otros']
    },
    {
      id: 159,
      authors: "Wall-Medrano, A",
      year: 2015,
      title: "El mango: aspectos agroindustriales, valor nutricional/funcional y",
      journal: "nutrici\u00f3n hospitalaria, 1, 67-75",
      doi: "https://doi.org/10.3305/nh.2015.31.1.7701",
      tags: ['Otros']
    },
    {
      id: 160,
      authors: "Xie, X., Chen, C., & Fu, X",
      year: 2021,
      title: "Study on the bioaccessibility of phenolic compounds and bioactivities of passion fruit juices from different regions in vitro digestion",
      journal: "Journal of Food Processing and Preservation, 45(1), e15056",
      doi: "https://doi.org/10.1111/jfpp.15056",
      tags: ['Otros']
    },
    {
      id: 161,
      authors: "Zampedri, C. A., Zampedri, P. A., Scattolaro, O., Zapata, L. M., & Castagnini, J. M",
      year: 2018,
      title: "Evaluaci\u00f3n de la digesti\u00f3n in vitro de compuestos bioactivos de ar\u00e1ndanos",
      journal: "Unknown",
      doi: "https://www.redalyc.org/journal/145/14560144012/html/",
      tags: ['Otros']
    },
    {
      id: 162,
      authors: "Zapata Osorio, L. \u00c1",
      year: 2021,
      title: "Elaboraci\u00f3n de un producto alimenticio funcional mediante el uso de pulpa liofilizada de guayaba agria (Psidium araca)",
      journal: "Unknown",
      doi: "https://repositorio.unal.edu.co/bitstream/handle/unal/80737/1040754390.2021.pdf?sequence=3&isAllowed=y",
      tags: ['Otros']
    },
    {
      id: 163,
      authors: "Zeraik, Maria Luiza, Janete H. Yariwake, Jean No\u00ebl Wauters, Monique Tits, and Luc Angenot",
      year: 2012,
      title: "Analysis of Passion Fruit Rinds (Passiflora Edulis): Isoorientin Quantification by HPTLC and Evaluation of Antioxidant (Radical Scavenging) Capacity",
      journal: "Quimica Nova 35(3):541\u201345",
      doi: "doi:10.1590/S0100-40422012000300019",
      tags: ['Otros']
    },
    {
      id: 164,
      authors: "Zhu, M., Fei, X., Gong, D., & Zhang, G",
      year: 2023,
      title: "Effects of Processing Conditions and Simulated Digestion In Vitro on the Antioxidant Activity, Inhibition of Xanthine Oxidase and Bioaccessibility of Epicatechin Gallate",
      journal: "Foods 2023, Vol. 12, Page 2807, 12(14), 2807",
      doi: "https://doi.org/10.3390/FOODS12142807",
      tags: ['Otros']
    }
  ];

  constructor(private titleService: CustomTitleService) { }

  ngOnInit(): void {
    this.titleService.set('Referencias Bibliográficas');
    this.dataSource.data = this.references;

    this.dataSource.filterPredicate = (data: Reference, filter: string) => {
      const q = filter.toLowerCase().trim();
      return data.title.toLowerCase().includes(q) ||
        data.authors.toLowerCase().includes(q) ||
        data.journal.toLowerCase().includes(q) ||
        data.tags.some(tag => tag.toLowerCase().includes(q));
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

}
