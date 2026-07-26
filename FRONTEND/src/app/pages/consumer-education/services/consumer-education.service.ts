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
        detailedExplanation: 'Es un proceso donde congelamos la fruta y extraemos el agua al vacío sin usar calor extremo. A diferencia del deshidratado común, no se queman ni se destruyen las vitaminas.',
        analogy: 'Imagina que le ponemos "pausa" a la fruta cuando está más fresca, retirándole solo el agua. ¡Al volver a hidratarla, despierta con todos sus superpoderes!',
        colorClass: 'card-blue'
      },
      {
        id: 'bioactivos',
        title: 'Compuestos Bioactivos',
        icon: '✨',
        shortDescription: 'Nutrientes que dan vida.',
        detailedExplanation: 'Son moléculas especiales presentes en las plantas (como vitaminas y pigmentos) que, además de nutrirte, tienen un efecto directo promoviendo tu salud y previniendo enfermedades.',
        analogy: 'Son como el "ejército secreto" de la fruta. No solo te dan energía, sino que patrullan tu cuerpo reparando daños.',
        colorClass: 'card-green'
      },
      {
        id: 'antioxidante',
        title: 'Poder Antioxidante',
        icon: '🛡️',
        shortDescription: 'El escudo protector.',
        detailedExplanation: 'Nuestras células se oxidan y envejecen por factores como el estrés y la contaminación (radicales libres). Los antioxidantes neutralizan este daño.',
        analogy: 'Piensa en una manzana cortada que se vuelve marrón al aire. Los antioxidantes son como el jugo de limón que le pones encima para que se mantenga fresca e intacta.',
        colorClass: 'card-purple'
      },
      {
        id: 'bioaccesibilidad',
        title: 'Bioaccesibilidad',
        icon: '🧬',
        shortDescription: 'Lo que realmente absorbes.',
        detailedExplanation: 'No sirve de nada comer 100mg de vitamina C si tu cuerpo solo absorbe 10mg. La bioaccesibilidad mide qué porcentaje de nutrientes realmente entra a tu sistema tras la digestión.',
        analogy: 'Es la diferencia entre el dinero que te pagan (lo que comes) y el dinero que te queda después de impuestos (lo que realmente llega a tu sangre).',
        colorClass: 'card-orange'
      }
    ];
  }
}
