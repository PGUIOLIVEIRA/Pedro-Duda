import { TimelineCard } from '../types';

export const INITIAL_LETTER_HTML = `
<p>Meu amor,</p>

<p>Já se passaram 5 anos desde o nosso momento mais lindo: o nosso casamento. Mas a nossa história começou muito antes dele. Antes daquele dia, já tínhamos vivido tantas coisas, conquistado tantas coisas absurdas, passado por experiências que transformaram nossas vidas e nos fizeram construir, pouco a pouco, uma vida cada vez mais feliz.</p>

<p>Tudo o que vivemos antes foi apenas o ponto de partida para uma vida inteira juntos. E hoje essa vida já completa 5 anos. Bodas de Madeira, né? ❤️</p>

<p>Nesses cinco anos fomos muito felizes. Buscamos viver tantas coisas, viajamos muito — hehe —, criamos memórias que vou guardar para sempre. Mas também passamos por momentos difíceis. Algumas coisas, eu sei, gostaríamos até de apagar da nossa mente. Mas, quando olho para trás, percebo que as coisas boas sempre foram muito maiores do que as ruins.</p>

<p>Nesses cinco anos, meu amor, aprendi com você a viver cada dia de uma maneira melhor, mais intensa e mais entregue. Mudei muito. E acho que mudei ainda mais depois da chegada da Mari. Kkkk.</p>

<p>Ela chegou às nossas vidas trazendo tanta coisa… e, acima de tudo, trouxe amor. Muito amor. É verdade que passamos por muitos perrengues com ela durante todo esse tempo, momentos que nos fizeram sofrer, ter medo e nos sentir impotentes. Mas ter a Mari conosco e saber que ela está bem é também ter a certeza de que o nosso amor cresce, se renova e renasce todos os dias.</p>

<p>Você também mudou muito ao longo desses anos, sabia?</p>

<p>E quero que saiba que foram mudanças lindas, mudanças que fizeram eu me apaixonar ainda mais por você.</p>

<p>Ver você crescendo naquilo que ama fazer é uma das coisas mais bonitas que existem para mim. Ver o quanto você é uma excelente enfermeira e o quanto é reconhecida pelo seu trabalho me enche de orgulho. E eu sempre vou dizer isso a você: eu sou muito orgulhoso de você e de tudo o que você faz!</p>

<p>É lindo ver o quanto você se dedica, o quanto se entrega e o quanto coloca amor naquilo que faz. E eu quero, e vou, sempre incentivar você, acreditar em você e estar ao seu lado, dando todo o apoio que puder.</p>

<p>Mas ver você se tornar mãe foi, sem dúvida, uma das coisas que mais me transformou também.</p>

<p>Ver a sua força, a sua garra e a sua coragem diante da dor intensa, do cansaço extremo, das injustiças e, principalmente, do medo de perder nossa menina, me fez entender que eu precisava sempre buscar ser melhor por vocês.</p>

<p>Tudo o que passamos naquele hospital foi uma transformação para mim. E o ano que veio depois também. Cada momento foi me moldando, me tirando da zona de conforto e me fazendo enxergar a vida de uma maneira diferente.</p>

<div class="my-6 p-4 rounded-xl bg-amber-100/70 border-l-4 border-terracotta text-center">
  <p class="text-2xl sm:text-3xl font-serif font-bold text-terracotta italic">"A Mari veio para ser LUZ."</p>
  <p class="text-sm text-wood-700 mt-1 italic">E como ela faz isso tão bem...</p>
</div>

<p>Mesmo quando pensamos que a luz dela estava se apagando, ela encontrou uma maneira de continuar brilhando. E eu sei que muito dessa força ela herdou de você.</p>

<p>Por fim, meu amor, obrigado.</p>

<p>Obrigado por esses cinco anos em que fui tão amado por você. Obrigado por me transformar no homem que sou e por me dar a capacidade de ser Pai. Obrigado por me ensinar, todos os dias, o que significa ser marido.</p>

<p>Obrigado por me lembrar que o nosso SIM é eterno.</p>

<p>Eu olho para tudo o que vivemos e percebo o quanto crescemos, o quanto mudamos e o quanto ainda temos para viver. E, mesmo sabendo que a vida nem sempre será fácil, eu quero continuar vivendo tudo ao seu lado.</p>

<p>Quero continuar viajando com você, rindo com você, enfrentando os perrengues, criando nossa filha, realizando nossos sonhos e construindo a nossa história.</p>

<p>Porque, no fim de tudo, é você que eu quero ao meu lado.</p>

<p class="text-2xl font-bold text-wood-900 mt-6 mb-2">TE AMO MAIS QUE TUDO NESSA VIDA.</p>

<p>Sem você, eu não seria quem sou hoje.</p>

<p>Obrigado por tudo, meu amor. Obrigado por cada momento, cada abraço, cada luta, cada conquista, cada sorriso e por todo o amor que você me dá.</p>

<p class="text-xl font-bold text-terracotta">Feliz 5 anos para nós, meu amorzinho! ❤️</p>

<p>Que venham muitos e muitos anos.</p>

<p class="font-script text-4xl sm:text-5xl text-wood-900 mt-6">Eu escolheria você Eternamente.</p>
`;

export const DEFAULT_TIMELINE: TimelineCard[] = [
  {
    id: 'year1',
    yearTitle: 'Ano 1 • O Nosso Início & Nosso Casamento',
    caption: 'O momento mais lindo: o nosso "SIM" no altar perante Deus e os primeiros passos construindo o nosso lar com muito amor, companheirismo e cumplicidade.',
    photos: [
      {
        id: 'p1_1',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        title: 'Bênção e o início de tudo (Igreja)',
      },
      {
        id: 'p1_2',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
        title: 'Nosso Casamento: O beijo no altar (25/09/2021)',
      },
    ],
  },
  {
    id: 'year2',
    yearTitle: 'Ano 2 • Viagens & Sorrisos',
    caption: 'Viajamos muito, hehe! Criamos memórias inesquecíveis, passeios a dois e a certeza de que a cada viagem nosso amor só se fortalecia.',
    photos: [
      {
        id: 'p2_1',
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
        title: 'Noite romântica sob as luzes',
      },
      {
        id: 'p2_2',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
        title: 'Dias ensolarados e mergulho no mar',
      },
    ],
  },
  {
    id: 'year3',
    yearTitle: 'Ano 3 • O Nosso Amor que Amadurece',
    caption: 'Amadurecemos como casal, comemorando cada conquista, rindo juntos e enfrentando qualquer desafio de mãos dadas.',
    photos: [
      {
        id: 'p3_1',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
        title: 'Celebrando o aniversário com bolo e vela',
      },
      {
        id: 'p3_2',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80',
        title: 'Passeio a dois sob as sombrinhas iluminadas',
      },
    ],
  },
  {
    id: 'year4',
    yearTitle: 'Ano 4 • A Chegada da Nossa Mari (Luz)',
    caption: 'A chegada da Mari mudou nossas vidas para sempre. Enfrentamos momentos difíceis no hospital, você se mostrou uma mãe gigante e nossa filha trouxe um amor infinito.',
    photos: [
      {
        id: 'p4_1',
        url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80',
        title: 'A Mari veio para ser LUZ (Nascimento)',
      },
      {
        id: 'p4_2',
        url: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&w=1000&q=80',
        title: 'O sorriso mais puro e encantador do mundo',
      },
    ],
  },
  {
    id: 'year5',
    yearTitle: 'Ano 5 • Bodas de Madeira: Família Completa',
    caption: 'Completamos 5 anos de casados! Nossas raízes sólidas e profundas. Orgulho gigantesco da enfermeira fantástica, mãe guerreira e mulher espetacular que você é.',
    photos: [
      {
        id: 'p5_1',
        url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
        title: 'Momentos felizes e passeios em família',
      },
      {
        id: 'p5_2',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
        title: 'Pedro, Duda & Mari: Nossa família, nosso amor eterno',
      },
    ],
  },
];

// Reference date: 5 years of marriage (25/09/2021)
export const DEFAULT_WEDDING_DATE = '2021-09-25T10:30:00';
