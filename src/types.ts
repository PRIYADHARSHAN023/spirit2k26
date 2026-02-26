export interface Event {
  id: string;
  name: string;
  category: 'Technical' | 'Non-Technical' | 'Online';
  description: string;
  details: {
    venue?: string;
    timeSlot?: string;
    handler: string;
    contact: {
      name: string;
      phone: string;
    };
    teamSize: string;
    requirements?: string[];
    rules?: string[];
    rounds?: string[];
    timing?: string;
    type?: string;
    selection?: string;
    date?: string;
  };
}

export const EVENTS: Event[] = [
  // Technical
  {
    id: 'paper-pres',
    name: 'Idea Presentation',
    category: 'Technical',
    description: 'Showcase your research and presentation skills.',
    details: {
      venue: 'Seminar Hall 1',
      timeSlot: 'Full Day',
      handler: 'G.Prathiksha',
      contact: { name: 'Jhonson Antony', phone: '6383185531' },
      teamSize: '3–4 members',
      requirements: ['Participants must bring Laptop'],
      rules: [
        'PPT format only',
        'Maximum 10 slides',
        'Project must be shortlisted',
        'Time: 5–7 minutes',
        'Judges decision final'
      ],
      timing: 'Full Day'
    }
  },
  {
    id: 'bug-buster',
    name: 'Bug Buster',
    category: 'Technical',
    description: 'Debug complex code and find the hidden logic.',
    details: {
      venue: 'Infozone',
      timeSlot: '11:10 AM – 12:10 PM',
      handler: 'Vishnu G',
      contact: { name: 'Vishnu G', phone: '9789781513' },
      teamSize: 'Individual',
      type: 'Individual',
      rounds: [
        'Round 1: Tanglish format code debugging.',
        'Round 2: Braille coding (Computer ON, Monitor OFF, Hardcopy code given, Type without screen).'
      ],
      timing: '10 Minutes each round',
      selection: 'Time and errors considered'
    }
  },
  {
    id: 'startup-30',
    name: '30 Minutes Startup',
    category: 'Technical',
    description: 'Create innovative solutions and pitch your startup idea.',
    details: {
      venue: 'Work Station',
      timeSlot: '12:00 PM – 1:00 PM',
      handler: 'Priyadharshan A',
      contact: { name: 'Priyadharshan A', phone: '8939723022' },
      teamSize: '3–4 members',
      requirements: ['Laptop'],
      rules: [
        'Create innovative solution',
        'AI tools allowed',
        'Idea creation training provided'
      ],
      timing: '45 Minutes'
    }
  },
  {
    id: 'prompt-prodigy',
    name: 'Prompt Prodigy',
    category: 'Technical',
    description: 'Master the art of AI communication and prompt engineering.',
    details: {
      venue: 'Infozone',
      timeSlot: '12:00 PM – 1:00 PM',
      handler: 'Padmapriya R N',
      contact: { name: 'Padmapriya R N', phone: '8778214419' },
      teamSize: 'Individual',
      rounds: [
        'Round 1: Logic Puzzle prompt writing.',
        'Round 2: Story clue prompt extraction.',
        'Round 3: Image prompt writing.'
      ]
    }
  },
  {
    id: 'web-design',
    name: 'Web Design',
    category: 'Technical',
    description: 'Create stunning, responsive, and functional web interfaces.',
    details: {
      venue: 'Work Station',
      timeSlot: '11:10 AM – 12:10 PM',
      handler: 'Logeshwaran G',
      contact: { name: 'Logeshwaran G', phone: '6374706481' },
      teamSize: '2–3 members',
      requirements: ['Laptop'],
      rules: [
        'Responsive design required',
        'Mobile friendly',
        'AI tools allowed'
      ],
      timing: '40 Minutes'
    }
  },

  // Non-Technical
  {
    id: 'connectify-fiesta',
    name: 'Connectify Fiesta',
    category: 'Non-Technical',
    description: 'Connect the dots and solve visual and lyrical puzzles.',
    details: {
      venue: 'Class Room',
      timeSlot: '12:00 PM – 1:00 PM',
      handler: 'Vyshali S',
      contact: { name: 'Vyshali S', phone: '7845250204' },
      teamSize: '3 members',
      rounds: [
        'Round 1: Picture → Find Song',
        'Round 2: Lyrics → Find Song',
        'Round 3: Act Movie → Guess Movie'
      ],
      rules: ['Wrong answer → Minus points'],
      timing: '10–20 Minutes per round'
    }
  },
  {
    id: 'blind-drawing',
    name: 'Blind Drawing',
    category: 'Non-Technical',
    description: 'Draw without looking, guided only by your team.',
    details: {
      venue: 'Class Room',
      timeSlot: '11:10 AM – 12:10 PM',
      handler: 'Keerthana K',
      contact: { name: 'Keerthana K', phone: '8778781887' },
      teamSize: '2–3 members',
      rules: [
        'Eyes covered',
        'Guide by voice only',
        'No touching',
        'Continuous drawing',
        'Fastest accurate drawing wins'
      ],
      timing: '15 Minutes'
    }
  },
  {
    id: 'stress-interview',
    name: 'Stress Interview',
    category: 'Non-Technical',
    description: 'Participants will face stressful interview questions. Difficult and confusing questions asked. Confidence tested.',
    details: {
      venue: 'Class Room',
      timeSlot: '2:00 PM – 3:00 PM',
      handler: 'Gokul',
      contact: { name: 'Gokul', phone: '7373138989' },
      teamSize: 'Individual Only',
      type: 'Individual Only'
    }
  },
  {
    id: 'emoji-story',
    name: 'Emoji Story Creation',
    category: 'Non-Technical',
    description: 'Tell a compelling story using only emojis.',
    details: {
      venue: 'Class Room',
      timeSlot: '2:00 PM – 3:00 PM',
      handler: 'Sarojini Banu P',
      contact: { name: 'Sarojini Banu P', phone: '9597761794' },
      teamSize: '2 members',
      rules: [
        'Paper and pen provided',
        'No mobile allowed',
        'Create story from emojis',
        'Perform within time',
        'Judges decision final'
      ],
      timing: '2–3 Minutes'
    }
  },

  // Online
  {
    id: 'free-fire',
    name: 'Free Fire Online Event',
    category: 'Online',
    description: 'Battle it out in the ultimate survival shooter.',
    details: {
      handler: 'Naveen Raj',
      contact: { name: 'Naveen Raj', phone: '6374520749' },
      teamSize: '4 Members',
      date: '08/03/2026',
      type: 'Online',
      rules: [
        'no rules clash squad',
        'no roof top',
        'body shot match',
        'if any improper game play the team will be eliminated.'
      ]
    }
  },
  {
    id: 'short-film',
    name: 'Short Film',
    category: 'Online',
    description: 'Capture moments and tell stories through the lens.',
    details: {
      handler: 'Priyadharshan',
      contact: { name: 'Priyadharshan', phone: '8939723022' },
      teamSize: 'Team',
      date: '08/03/2026',
      type: 'Online',
      rules: [
        'no rules full freedom for a creativity and its open theme you can participate with any theme but not allowed for already prize winning short films and dont use any copyright songs',
        'use any cameras',
        'try to avoid already award winning short films'
      ]
    }
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'Online',
    description: 'Capture the essence of the symposium on campus.',
    details: {
      handler: 'Kanmani',
      contact: { name: 'Kanmani', phone: '9342247385' },
      teamSize: 'Individual',
      timing: 'Full Day',
      type: 'On Campus'
    }
  },
];

export interface Registration {
  id?: number;
  registrationId?: string;
  name: string;
  college: string;
  department: string;
  year: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  events: string[];
  paymentStatus: 'Pending' | 'Completed';
  paymentScreenshot: string; // base64
  created_at?: string;
}
