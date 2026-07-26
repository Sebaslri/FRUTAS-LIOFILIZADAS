import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerEducationService } from '../../services/consumer-education.service';
import { EducationCapsule } from '../../models/education-capsule.interface';

@Component({
  selector: 'app-consumer-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consumer-education.component.html',
  styleUrls: ['./consumer-education.component.css']
})
export class ConsumerEducationComponent {
  private readonly educationService = inject(ConsumerEducationService);
  
  capsules: EducationCapsule[] = [];
  activeCapsuleId: string | null = null;
  activeSectionIndex: number | null = 0; // The first accordion section is open by default

  sections = [
    {
      title: '1. Datos generales de la Fruta',
      colorClass: 'section-green',
      content: 'Las primeras columnas verdes indican características físicas y químicas básicas de la fruta fresca:',
      items: [
        { name: 'Frutas', desc: 'nombre de la fruta analizada.' },
        { name: 'Región', desc: 'de dónde proviene, por ejemplo, Costa, Sierra u Oriente.' },
        { name: 'Densidad', desc: 'qué tan "compacta" o pesada es la fruta respecto a su volumen. Una fruta más densa pesa más ocupando el mismo espacio.' },
        { name: 'Grados Brix', desc: 'cantidad aproximada de azúcar. Mientras más alto sea el número, más dulce suele ser la fruta.' },
        { name: 'Acidez', desc: 'cantidad de ácidos naturales que tiene la fruta. Un valor más alto normalmente significa sabor más ácido.' },
        { name: 'Índice de madurez', desc: 'relación entre dulzor y acidez. Sirve para estimar qué tan madura está la fruta.' },
        { name: 'pH', desc: 'mide si la fruta es ácida o no. Un pH bajo significa que es más ácida.' },
        { name: 'L*', desc: 'indica qué tan clara u oscura es la fruta. Cerca de 100 es más clara; cerca de 0 es más oscura.' },
        { name: 'a*', desc: 'representa colores entre verde y rojo. Valores negativos tienden al verde; positivos tienden al rojo.' },
        { name: 'b*', desc: 'representa colores entre azul y amarillo. Valores positivos suelen indicar más amarillo.' },
        { name: 'Firmeza', desc: 'qué tan dura o blanda está la fruta.' },
        { name: 'Humedad', desc: 'porcentaje de agua que contiene la fruta.' },
        { name: 'Cenizas', desc: 'cantidad de minerales que quedan después de eliminar toda el agua y materia orgánica de una muestra. No son cenizas "sucias"; es una forma científica de medir minerales.' }
      ]
    },
    {
      title: '2. Datos de Fruta Fresca: “FF”',
      colorClass: 'section-green-light',
      content: 'Las columnas con FF se refieren a fruta fresca, es decir, antes de liofilizarla. Aunque varias columnas parecen medir "antioxidantes", no son idénticas: cada prueba analiza una parte diferente de los compuestos antioxidantes.',
      items: [
        { name: 'DPPH - FF', desc: 'mide la capacidad antioxidante de la fruta fresca. En palabras simples: cuánto puede ayudar a neutralizar sustancias que dañan células, llamadas radicales libres.' },
        { name: 'Fenoles Totales Folin-Ciocalteu - FF', desc: 'mide compuestos naturales llamados fenoles, relacionados con antioxidantes.' },
        { name: 'FRAP - FF', desc: 'es otra forma de medir capacidad antioxidante. No es exactamente igual al DPPH, pero ambos buscan saber qué tanto potencial antioxidante tiene la muestra.' },
        { name: 'mg Qc Eq/de fruta fresca', desc: 'cantidad de flavonoides en fruta fresca. "Qc Eq" significa equivalente de quercetina, una sustancia usada como referencia.' },
        { name: 'mg AT/g de fruta fresca', desc: 'cantidad de antocianinas en fruta fresca. Las antocianinas son pigmentos naturales, comunes en frutas moradas, rojas o azuladas.' }
      ]
    },
    {
      title: '3. Datos de fruta liofilizada: “FL”',
      colorClass: 'section-blue',
      content: 'Estas columnas azules corresponden a la fruta después de ser liofilizada. Liofilizar significa quitarle casi toda el agua mediante congelación y vacío. La fruta queda seca, ligera y puede conservarse más tiempo, pero mantiene gran parte de sus componentes. La idea principal es comparar estas columnas con las de fruta fresca para observar si la liofilización conserva, reduce o concentra ciertos componentes.',
      items: [
        { name: 'DPPH - FL', desc: 'capacidad antioxidante de la fruta liofilizada.' },
        { name: 'FRAP - FL', desc: 'otra medición de capacidad antioxidante en la fruta liofilizada.' },
        { name: 'Fenoles Totales Folin-Ciocalteu - FL', desc: 'cantidad de fenoles en la fruta liofilizada.' },
        { name: 'mg Qc Eq Ext Sc/g fruta liofilizada', desc: 'flavonoides encontrados en la fruta liofilizada.' },
        { name: 'mg AT Ext Sc/g fruta liofilizada', desc: 'antocianinas encontradas en la fruta liofilizada.' }
      ]
    },
    {
      title: '4. Datos de infusión y digestión',
      colorClass: 'section-orange',
      content: 'Las columnas anaranjadas parecen estudiar qué pasa cuando la fruta liofilizada se prepara como bebida o pasa por una simulación de digestión. La palabra importante aquí es bioaccesibilidad: no significa exactamente cuánto tiene la fruta, sino cuánto de eso puede quedar disponible para que el cuerpo lo aproveche.',
      items: [
        { name: 'CAP. ANT. Infusión', desc: 'capacidad antioxidante de la bebida preparada con la fruta.' },
        { name: 'CAP. ANT. Digerido', desc: 'capacidad antioxidante después de simular la digestión.' },
        { name: '% Bioaccesibilidad carotenoides', desc: 'porcentaje de carotenoides que el cuerpo podría aprovechar después de la digestión.' },
        { name: '% Bioaccesibilidad flavonoides', desc: 'porcentaje de flavonoides que potencialmente quedan disponibles para ser absorbidos.' },
        { name: '% Bioaccesibilidad Ác. Asc.', desc: 'porcentaje de ácido ascórbico, es decir vitamina C, que queda disponible tras la digestión.' }
      ]
    },
    {
      title: '5. Comparación de infusiones (Temperaturas)',
      colorClass: 'section-yellow',
      content: 'Las últimas columnas amarillas comparan bebidas preparadas a dos temperaturas (ambiente vs caliente). Esto sirve para saber si preparar la bebida caliente ayuda a extraer más antioxidantes y fenoles.',
      items: [
        { name: 'Actividad Antioxidante DPPH Infusiones 22 °C', desc: 'antioxidantes medidos en una infusión a temperatura ambiente.' },
        { name: 'Actividad Antioxidante DPPH Infusiones 90 °C', desc: 'antioxidantes medidos en una infusión con agua caliente.' },
        { name: 'Fenoles Totales Infusiones 22 °C', desc: 'fenoles que pasan al agua a temperatura ambiente.' },
        { name: 'Fenoles Totales Infusiones 90 °C', desc: 'fenoles que pasan al agua caliente.' }
      ]
    }
  ];

  summaryItems = [
    { label: 'Verde', desc: 'propiedades físicas y químicas de la fruta.', color: '#4caf50' },
    { label: 'Celeste', desc: 'antioxidantes y compuestos de la fruta liofilizada.', color: '#03a9f4' },
    { label: 'Naranja', desc: 'comportamiento después de preparar o digerir la fruta.', color: '#ff9800' },
    { label: 'Amarillo', desc: 'comparación de infusiones frías o calientes.', color: '#ffeb3b' },
    { label: 'FF', desc: 'fruta fresca.', color: '#607d8b' },
    { label: 'FL', desc: 'fruta liofilizada.', color: '#607d8b' },
    { label: 'Múltiples filas', desc: 'repeticiones del experimento por cada fruta.', color: '#607d8b' }
  ];

  ngOnInit() {
    this.capsules = this.educationService.getCapsules();
  }

  toggleCapsule(id: string) {
    if (this.activeCapsuleId === id) {
      this.activeCapsuleId = null;
    } else {
      this.activeCapsuleId = id;
    }
  }

  toggleSection(index: number) {
    if (this.activeSectionIndex === index) {
      this.activeSectionIndex = null;
    } else {
      this.activeSectionIndex = index;
    }
  }
}
