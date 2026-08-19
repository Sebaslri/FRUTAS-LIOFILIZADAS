import { Component, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.css'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ReferencesComponent implements OnInit {
  searchQuery: string = '';

  references: Reference[] = [
    {
      id: 1,
      authors: 'Al-Radadi, N. S., et al.',
      year: 2024,
      title: 'Plant-Mediated Green Synthesis of Gold Nanoparticles Using an Aqueous Extract of Passiflora Ligularis...',
      journal: 'Saudi Pharmaceutical Journal',
      doi: '10.1016/J.JSPS.2023.101921',
      tags: ['Granadilla']
    },
    {
      id: 2,
      authors: 'Angel-Isaza, J., et al.',
      year: 2023,
      title: 'Potential Hypoglycemic and Antilipidemic Activity of Polyphenols from Passiflora Ligularis (Granadilla).',
      journal: 'Molecules',
      doi: '10.3390/MOLECULES28083551',
      tags: ['Granadilla']
    },
    {
      id: 3,
      authors: 'Añibarro-Ortega, M., et al.',
      year: 2025,
      title: 'Nutrients, Phytochemicals, and In Vitro Biological Activities of Goldenberry (Physalis Peruviana L.) Fruit and Calyx.',
      journal: 'Plants',
      doi: '10.3390/PLANTS14030327/S1',
      tags: ['Otros']
    },
    {
      id: 4,
      authors: 'Añibarro-Ortega, M., et al.',
      year: 2025,
      title: 'Nutrients, Phytochemicals, and In Vitro Antioxidant and Antimicrobial Activities of Lulo (Solanum Quitoense Lam.) Fruit...',
      journal: 'Foods',
      doi: '10.3390/FOODS14122083/S1',
      tags: ['Lulo']
    },
    {
      id: 5,
      authors: 'Cádiz-Gurrea, M. L., et al.',
      year: 2014,
      title: 'Isolation, Comprehensive Characterization and Antioxidant Activities of Theobroma Cacao Extract.',
      journal: 'Journal of Functional Foods',
      doi: '10.1016/J.JFF.2014.07.016',
      tags: ['Cacao']
    },
    {
      id: 6,
      authors: 'Candra, A., et al.',
      year: 2025,
      title: 'Impact of Honey-Enriched Soursop Leaves (Annona Muricata) Kombucha on Lipid Profiles and Hypoglycemic Properties...',
      journal: 'Biocatalysis and Agricultural Biotechnology',
      doi: '10.1016/J.BCAB.2025.103713',
      tags: ['Guanábana']
    },
    {
      id: 7,
      authors: 'Corrêa, L. C., et al.',
      year: 2011,
      title: 'Antioxidant Content in Guava (Psidium Guajava) and Araçá (Psidium Spp.) Germplasm from Different Brazilian Regions.',
      journal: 'Plant Genetic Resources',
      doi: '10.1017/S1479262111000025',
      tags: ['Guayaba']
    },
    {
      id: 8,
      authors: 'Do, Y. V., et al.',
      year: 2024,
      title: 'Assessment of the Changes in Product Characteristics... of Dried Soursop Fruit Tea (Annona Muricata L.)',
      journal: 'Food Science and Nutrition',
      doi: '10.1002/FSN3.3949',
      tags: ['Guanábana']
    },
    {
      id: 9,
      authors: 'Gutiérrez, R. M. P., et al.',
      year: 2008,
      title: 'Psidium Guajava: A Review of Its Traditional Uses, Phytochemistry and Pharmacology.',
      journal: 'Journal of Ethnopharmacology',
      doi: '10.1016/j.jep.2008.01.025',
      tags: ['Guayaba']
    },
    {
      id: 10,
      authors: 'Hartati, R., et al.',
      year: 2024,
      title: 'Optimization of Antioxidant Activity of Soursop (Annona Muricata L.) Leaf Extract Using Response Surface Methodology.',
      journal: 'Biomedical Reports',
      doi: '10.3892/BR.2024.1854/ABSTRACT',
      tags: ['Guanábana']
    },
    {
      id: 11,
      authors: 'Hewavitharana, A. K., et al.',
      year: 2013,
      title: 'Between Fruit Variability of the Bioactive Compounds, β-Carotene and Mangiferin, in Mango (Mangifera Indica).',
      journal: 'Nutrition and Dietetics',
      doi: '10.1111/1747-0080.12009',
      tags: ['Mango']
    },
    {
      id: 12,
      authors: 'Jainu, M., et al.',
      year: 2005,
      title: 'In Vitro and in Vivo Evaluation of Free-Radical Scavenging Potential of Cissus Quadrangularis.',
      journal: 'Pharmaceutical Biology',
      doi: '10.1080/13880200500406636',
      tags: ['Otros']
    },
    {
      id: 13,
      authors: 'Lima, G. V. S., et al.',
      year: 2025,
      title: 'Targeted Metabolomics for Quantitative Assessment of Polyphenols and Methylxanthines in Fermented and Unfermented Cocoa Beans...',
      journal: 'Food Research International',
      doi: '10.1016/j.foodres.2025.116394',
      tags: ['Cacao']
    },
    {
      id: 14,
      authors: 'Lutz, M., et al.',
      year: 2015,
      title: 'Phenolic Content and Antioxidant Capacity in Fresh and Dry Fruits and Vegetables Grown in Chile.',
      journal: 'CYTA - Journal of Food',
      doi: '10.1080/19476337.2015.1012743',
      tags: ['Otros']
    },
    {
      id: 15,
      authors: 'Monzón Daza, G., et al.',
      year: 2021,
      title: 'Identification of Α Amylase and Α Glucosidase and Ligularoside A... from Passiflora Ligularis Juss (Sweet Granadilla)',
      journal: 'Journal of Agricultural and Food Chemistry',
      doi: '10.1021/ACS.JAFC.0C07850',
      tags: ['Granadilla']
    },
    {
      id: 16,
      authors: 'Rey, D. P., et al.',
      year: 2024,
      title: 'Antidiabetic Effect of Passiflora Ligularis Leaves in High Fat-Diet/Streptozotocin-Induced Diabetic Mice.',
      journal: 'Nutrients',
      doi: '10.3390/NU16111669',
      tags: ['Granadilla']
    },
    {
      id: 17,
      authors: 'Rodríguez-Basso, A. G., et al.',
      year: 2026,
      title: 'Chemical Profile and In Vitro Protective Effects of Minthostachys Verticillata (Griseb.) Epling Aqueous Extract...',
      journal: 'Plants',
      doi: '10.3390/plants15010069',
      tags: ['Otros']
    },
    {
      id: 18,
      authors: 'Sanlier, N., et al.',
      year: 2026,
      title: 'Potential Health Benefits of Bromelain: A Critical Review of the Current Literature.',
      journal: 'Frontiers in Nutrition',
      doi: '10.3389/FNUT.2026.1744666/FULL',
      tags: ['Otros']
    },
    {
      id: 19,
      authors: 'Scharf, R. M., et al.',
      year: 2024,
      title: 'Antimutagenic and Antitumor Activities of a Water-Soluble Fraction of Soursop (Syn Graviola, Annona Muricata L.) Fruit Pulp.',
      journal: 'Journal of Toxicology and Environmental Health',
      doi: '10.1080/15287394.2024.2309335',
      tags: ['Guanábana']
    },
    {
      id: 20,
      authors: 'Silva, L. M. P., et al.',
      year: 2018,
      title: 'Isolation and Identification of the Five Novel Flavonoids from Genipa Americana Leaves.',
      journal: 'Molecules',
      doi: '10.3390/molecules23102521',
      tags: ['Otros']
    },
    {
      id: 21,
      authors: 'Tequin-Ocampo, E. B., et al.',
      year: 2026,
      title: 'Physicochemical Characteristics and Antioxidant Capacity of Total Phenolic Compounds in Colombian Passiflora Ligularis Juss.',
      journal: 'Discover Food',
      doi: '10.1007/S44187-026-00821-3',
      tags: ['Granadilla']
    },
    {
      id: 22,
      authors: 'Valerio de Mello Braga, L. L., et al.',
      year: 2025,
      title: 'Type I Arabinogalactan and Methyl-Esterified Homogalacturonan Polysaccharides from Tamarillo (Solanum Betaceum Cav.)...',
      journal: 'Pharmaceuticals',
      doi: '10.3390/PH18040461',
      tags: ['Tomate de árbol']
    },
    {
      id: 23,
      authors: 'Zeraik, M. L., et al.',
      year: 2012,
      title: 'Analysis of Passion Fruit Rinds (Passiflora Edulis): Isoorientin Quantification... and Evaluation of Antioxidant Capacity.',
      journal: 'Quimica Nova',
      doi: '10.1590/S0100-40422012000300019',
      tags: ['Maracuyá']
    },
    {
      id: 24,
      authors: 'Quintero-Gamero, G., et al.',
      year: 2025,
      title: 'Optimization of the encapsulation of arazá pulp by spray drying: Physicochemical, morphological and in vitro digestion studies.',
      journal: 'Applied Food Research',
      doi: '10.1016/j.afres.2025.100831',
      tags: ['Otros']
    },
    {
      id: 25,
      authors: 'Chiquiza-Montaño, L. N., et al.',
      year: 2025,
      title: 'Volatiles of the exotic Colombian fruit Borojó (Alibertia patinoi Cuatrecasas) (Rubiaceae) at different ripening stages.',
      journal: 'ACS Food Science & Technology',
      doi: '10.1021/acsfoodscitech.4c00591',
      tags: ['Otros']
    },
    {
      id: 26,
      authors: 'Quintero, I., et al.',
      year: 2025,
      title: 'Dry cacao pulp in chocolate bars: A sustainable, nutrient-rich sweetener with enhanced sensory quality...',
      journal: 'Applied Food Research',
      doi: '10.1016/j.afres.2025.100700',
      tags: ['Cacao']
    },
    {
      id: 27,
      authors: 'Castro, O., et al.',
      year: 2026,
      title: 'Zero waste formulation: A simplex-lattice approach to explore the potential of Amazonian juice residues...',
      journal: 'Journal of Food Process Engineering',
      doi: '10.1111/jfpe.70502',
      tags: ['Granadilla', 'Otros']
    },
    {
      id: 28,
      authors: 'Parra-Coronado, A., et al.',
      year: 2020,
      title: 'Postharvest behavior and quality changes of guava (Psidium guajava L.): A review.',
      journal: 'Progress in Science and Technology',
      doi: '10.14719/pst.7390',
      tags: ['Guayaba']
    },
    {
      id: 29,
      authors: 'Lin, S., et al.',
      year: 2025,
      title: 'Non-destructive prediction of soluble solids content and firmness and maturity determination of guava fruit...',
      journal: 'Postharvest Biology and Technology',
      doi: '10.1016/j.postharvbio.2025.113620',
      tags: ['Guayaba']
    },
    {
      id: 30,
      authors: 'Téllez-García, J., et al.',
      year: 2025,
      title: 'Evaluation of NIRS portable sensors for the determination of the physicochemical quality and maturity of intact mangoes.',
      journal: 'Scientia Horticulturae',
      doi: '10.1016/j.scienta.2025.114514',
      tags: ['Mango']
    },
    {
      id: 31,
      authors: 'Souza, H. F., et al.',
      year: 2023,
      title: 'New formulations of fermented milk drinks with fruit pulp added: Physicochemical characteristics during storage...',
      journal: 'Revista Chilena de Nutrición',
      doi: '10.4067/S0717-75182023000500496',
      tags: ['Otros']
    },
    {
      id: 32,
      authors: 'Tong, X., et al.',
      year: 2026,
      title: 'Multidimensional evaluation of fruit color differentiation in Rubus hirsutus Thunb...',
      journal: 'International Journal of Food Science',
      doi: '10.1155/jfpp/8921700',
      tags: ['Otros']
    },
    {
      id: 33,
      authors: 'Aguirre-López, D. A., et al.',
      year: 2023,
      title: 'Compuestos orgánicos volátiles presentes en el aroma de 17 frutas exóticas en Colombia: revisión.',
      journal: 'Revista Colombiana de Investigaciones Agroindustriales',
      doi: '10.23850/24220582.5208',
      tags: ['Otros']
    },
    {
      id: 34,
      authors: 'Yoplac, I., et al.',
      year: 2025,
      title: 'Influence of maturity stage and storage time on physicochemical and bioactive properties of yellow pitahaya...',
      journal: 'Journal of Food Processing and Preservation',
      doi: '10.1155/jfpp/2494113',
      tags: ['Otros']
    },
    {
      id: 35,
      authors: 'Suárez-Tapia, A., & Koshio, K.',
      year: 2026,
      title: 'Fruit quality regulation in passion fruit (Passiflora edulis): Biological mechanisms, omics evidence...',
      journal: 'Agriculture',
      doi: '10.3390/agriculture16090958',
      tags: ['Maracuyá']
    },
    {
      id: 36,
      authors: 'Bazalar Pereda, M. S., et al.',
      year: 2023,
      title: 'Volatile compound profile and sensory features of cape gooseberry (Physalis peruviana Linnaeus)...',
      journal: 'European Food Research and Technology',
      doi: '10.1007/s00217-022-04191-9',
      tags: ['Otros']
    },
    {
      id: 37,
      authors: 'Quintero Ramírez, M., et al.',
      year: 2023,
      title: 'Volatilomic profile of the tree tomato (Solanum betaceum Cav.) pulp during ripening and senescence using HS–SPME with GC–MS.',
      journal: 'LWT',
      doi: '10.1016/j.lwt.2023.115213',
      tags: ['Tomate de árbol']
    }
  ];

  filteredReferences: Reference[] = [];

  constructor(private titleService: CustomTitleService) { }

  ngOnInit(): void {
    this.titleService.set('Referencias Bibliográficas');
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.references;

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.authors.toLowerCase().includes(q) ||
        r.journal.toLowerCase().includes(q) ||
        r.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    this.filteredReferences = filtered;
  }

}
