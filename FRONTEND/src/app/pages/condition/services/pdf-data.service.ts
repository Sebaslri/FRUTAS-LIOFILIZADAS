import { Injectable } from '@angular/core';

export interface BioactiveCompound {
  name: string;
  benefits: string;
}

export interface PdfFruitData {
  fruitId: number;
  compounds: BioactiveCompound[];
}

@Injectable({
  providedIn: 'root'
})
export class PdfDataService {

  public getFruitData(fruitId: number): BioactiveCompound[] {
    const data = this.getAllData().find(f => f.fruitId === fruitId);
    return data ? data.compounds : [];
  }

  private getAllData(): PdfFruitData[] {
    return [
      {
        fruitId: 1, // Arazá
        compounds: [
          {
            name: 'Vitamina C (ácido ascórbico)',
            benefits: 'Refuerzo del sistema inmunológico, posible coadyuvante en anemia (por mejorar la absorción de hierro) y potencial efecto antioxidante en la prevención de complicaciones asociadas a inflamación y dislipidemia.'
          },
          {
            name: 'Polifenoles y flavonoides',
            benefits: 'Incluyen compuestos como quercetina e importantes por su actividad antioxidante. Ayudan en inflamación, dislipidemia (colesterol elevado), hiperglucemia, efectos protectores vasculares (potencial beneficio en hipertensión) y soporte inmunológico.'
          }
        ]
      },
      {
        fruitId: 2, // Borojó
        compounds: [
          {
            name: 'Polifenoles (ácidos fenólicos y flavonoides)',
            benefits: 'Actividad antioxidante que mejora la función endotelial (hipertensión), disminuyen radicales libres y citocinas proinflamatorias (inflamación), y mejoran la sensibilidad a la insulina (glucemia elevada).'
          },
          {
            name: 'Fibra dietética',
            benefits: 'Favorece el tránsito intestinal y aumenta el volumen fecal, previniendo el estreñimiento.'
          },
          {
            name: 'Vitamina C',
            benefits: 'Favorece la absorción intestinal del hierro no hemínico, ayudando a prevenir la anemia por deficiencia de hierro.'
          }
        ]
      },
      {
        fruitId: 3, // Cacao
        compounds: [
          {
            name: 'Teobromina',
            benefits: 'Efectos vasodilatadores y mejora del flujo sanguíneo, potencialmente útil en hipertensión.'
          },
          {
            name: 'Epicatequina y Catequina',
            benefits: 'Potente antioxidante y antiinflamatorio, modulador de glucosa y lípidos, con potencial protector cardiovascular.'
          },
          {
            name: 'Proantocianidinas',
            benefits: 'Actividad antioxidante y protectora vascular, asociada a reducción de colesterol y glucosa; también modula el sistema inmunológico.'
          }
        ]
      },
      {
        fruitId: 4, // Granadilla
        compounds: [
          {
            name: 'Polifenoles totales',
            benefits: 'Reducción de glucemia, mejora de sensibilidad a insulina, mejora de estrés oxidativo y perfil lipídico (reducción de colesterol y triglicéridos).'
          },
          {
            name: 'Flavonoides',
            benefits: 'Estimulan captación de glucosa, tienen efecto antioxidante y antiinflamatorio, y mejoran parámetros cognitivos.'
          }
        ]
      },
      {
        fruitId: 5, // Guanábana
        compounds: [
          {
            name: 'Acetogeninas',
            benefits: 'Propiedades antimutagénicas y quimiopreventivas.'
          },
          {
            name: 'Flavonoides y polifenoles totales',
            benefits: 'Alta capacidad antioxidante y antiinflamatoria (estrés oxidativo). Reducción de glucosa sanguínea y mejora del perfil lipídico (diabetes y dislipidemia).'
          },
          {
            name: 'Vitamina C y carotenoides',
            benefits: 'Refuerzo del sistema inmunológico, protección antioxidante y prevención de anemia.'
          }
        ]
      },
      {
        fruitId: 6, // Guayaba
        compounds: [
          {
            name: 'Vitamina C',
            benefits: 'Antioxidante, refuerzo inmunológico (prevención de infecciones), prevención de anemia ferropénica.'
          },
          {
            name: 'Polifenoles y flavonoides',
            benefits: 'Antiinflamatorio, hipoglucemiante (ayuda en diabetes), antimicrobiano, antiespasmódico y antialérgico.'
          },
          {
            name: 'Carotenoides (licopeno, beta-caroteno)',
            benefits: 'Actividad antioxidante, prevención de enfermedades cardiovasculares y degenerativas.'
          }
        ]
      },
      {
        fruitId: 7, // Mango
        compounds: [
          {
            name: 'Mangiferina (xantona)',
            benefits: 'Antioxidante y antiinflamatorio (prevención de enfermedades cardiovasculares y neurodegenerativas), hipoglucemiante, y potencial anticancerígeno.'
          },
          {
            name: 'Carotenoides',
            benefits: 'Protege células frente a radicales libres, salud ocular (degeneración macular), y salud cardiovascular.'
          },
          {
            name: 'Vitamina C',
            benefits: 'Refuerzo inmunológico, potente antioxidante y prevención de anemia ferropénica.'
          }
        ]
      },
      {
        fruitId: 8, // Maracuyá
        compounds: [
          {
            name: 'Isoorientina (flavonoide)',
            benefits: 'Potente antioxidante que ayuda a contrarrestar el daño oxidativo y prevenir enfermedades crónicas, cardiovasculares y neurodegenerativas.'
          }
        ]
      },
      {
        fruitId: 9, // Mora
        compounds: [
          {
            name: 'Polifenoles, antocianinas y flavonoides',
            benefits: 'Potente actividad antioxidante y antiinflamatoria. Previenen enfermedades crónicas asociadas al estrés oxidativo, cardiovasculares y neurodegenerativas.'
          },
          {
            name: 'Vitamina C',
            benefits: 'Refuerzo inmunológico, prevención de infecciones, apoyo en la absorción de hierro y protección celular.'
          }
        ]
      },
      {
        fruitId: 10, // Naranjilla
        compounds: [
          {
            name: 'Polifenoles y flavonoides',
            benefits: 'Antioxidante y antimicrobiano (inhibición de hongos y bacterias patógenas).'
          },
          {
            name: 'Vitamina C',
            benefits: 'Refuerzo inmunológico, prevención de infecciones y apoyo en la prevención de anemia ferropénica.'
          },
          {
            name: 'Carotenoides',
            benefits: 'Antioxidante, prevención de enfermedades degenerativas, salud ocular y cardiovascular.'
          }
        ]
      },
      {
        fruitId: 11, // Piña
        compounds: [
          {
            name: 'Bromelina',
            benefits: 'Actividad antiinflamatoria y antitrombótica que puede favorecer la salud cardiovascular y combatir hipertensión arterial.'
          },
          {
            name: 'Vitamina C',
            benefits: 'Incrementa la biodisponibilidad del hierro consumido en la dieta, aportando a la prevención de la anemia.'
          }
        ]
      },
      {
        fruitId: 12, // Pitahaya
        compounds: [
          {
            name: 'Betalaínas y Polifenoles',
            benefits: 'Reducen el estrés oxidativo e inhiben moléculas proinflamatorias (Inflamación). Disminuyen el daño oxidativo favoreciendo la salud cardiovascular (presión arterial y colesterol).'
          },
          {
            name: 'Vitamina C',
            benefits: 'Mejora la absorción del hierro no hemo, contrarrestando la anemia.'
          }
        ]
      },
      {
        fruitId: 13, // Taxo
        compounds: [
          {
            name: 'Antioxidantes (polifenoles y flavonoides)',
            benefits: 'Contribuyen a reducir la presión arterial alta, el daño oxidativo y modulan las respuestas inflamatorias. También protegen contra daño hepático.'
          },
          {
            name: 'Vitamina C',
            benefits: 'Asociada a la mejora del sistema inmunológico y protección antioxidante general.'
          }
        ]
      },
      {
        fruitId: 14, // Tomate de árbol
        compounds: [
          {
            name: 'Antocianinas, Polifenoles y Carotenoides',
            benefits: 'Mejoran la función vascular y reducen oxidación de lípidos (enfermedades cardiovasculares). Tienen propiedades antiinflamatorias y modulan la glucemia elevada.'
          },
          {
            name: 'Vitamina C',
            benefits: 'Mejora la absorción de hierro (anemia), refuerza el sistema inmunológico e inhibe procesos inflamatorios.'
          }
        ]
      },
      {
        fruitId: 15, // Uvilla
        compounds: [
          {
            name: 'Fenoles y flavonoides',
            benefits: 'Neutralizan radicales libres (inflamación), apoyan el control de glucosa (diabetes) y previenen daño vascular (cardiovasculares).'
          },
          {
            name: 'Vitamina C y tocoferoles',
            benefits: 'Refuerzan la inmunidad y la defensa antioxidante. Mejoran la absorción de hierro para prevenir la anemia.'
          },
          {
            name: 'Carotenoides',
            benefits: 'Protegen frente al daño oxidativo y contribuyen a la salud ocular y vascular.'
          }
        ]
      }
    ];
  }
}
