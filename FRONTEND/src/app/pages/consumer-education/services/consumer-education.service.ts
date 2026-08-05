import { Injectable } from '@angular/core';
import { EducationCapsule } from '../models/education-capsule.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsumerEducationService {

  getCapsules(): EducationCapsule[] {
    return [
      {
        id: 'liofilizacion',
        title: 'Liofilización',
        icon: '🧊',
        shortDescription: 'Deshidratación en frío.',
        detailedExplanation: 'La liofilización es un método de conservación que elimina el agua mediante congelación y sublimación, permitiendo mantener mejor el color, aroma, sabor y compuestos bioactivos de los alimentos.',
        analogy: 'Imagina que le ponemos "pausa" a la fruta cuando está más fresca, retirándole solo el agua. ¡Al volver a hidratarla, despierta con todos sus superpoderes!',
        colorClass: 'card-blue'
      },
      {
        id: 'bioactivos',
        title: 'Compuestos Bioactivos',
        icon: '✨',
        shortDescription: 'Nutrientes que dan vida.',
        detailedExplanation: 'Son sustancias naturales presentes en frutas y vegetales que, además de aportar valor nutricional, ejercen efectos beneficiosos sobre la salud.',
        analogy: 'Son como el "ejército secreto" de la fruta. No solo te dan energía, sino que patrullan tu cuerpo reparando daños.',
        colorClass: 'card-green'
      },
      {
        id: 'antioxidante',
        title: 'Poder Antioxidante',
        icon: '🛡️',
        shortDescription: 'El escudo protector.',
        detailedExplanation: 'Es la capacidad que tienen ciertos compuestos para neutralizar los radicales libres y disminuir el daño oxidativo en las células.',
        analogy: 'Piensa en una manzana cortada que se vuelve marrón al aire. Los antioxidantes son como el jugo de limón que le pones encima para que se mantenga fresca e intacta.',
        colorClass: 'card-purple'
      },
      {
        id: 'bioaccesibilidad',
        title: 'Bioaccesibilidad',
        icon: '🧬',
        shortDescription: 'Lo que realmente absorbes.',
        detailedExplanation: 'Es la fracción de un compuesto presente en un alimento que se libera durante la digestión y queda disponible para ser absorbida por el organismo.',
        analogy: 'Es la diferencia entre el dinero que te pagan (lo que comes) y el dinero que te queda después de impuestos (lo que realmente llega a tu sangre).',
        colorClass: 'card-orange'
      }
    ];
  }
}
