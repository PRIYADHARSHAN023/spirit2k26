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
    fee?: number;
    upiId?: string;
    qrAsset?: string;
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
        'Problem Statement: Open Problem Statement (Any theme allowed)',
        'Selection: Submit -> Review -> Status Update (Call Selected/Refund Not Selected)',
        'Last Date: 05/03/2026',
        'Shortlist Date: 06/03/2026',
        'Time: 5–7 minutes'
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
        'Guide by friends or team mate (voice only)',
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
    description: 'A comedy show under pressure. Unexpected questions, dramatic reactions, and unlimited entertainment!',
    details: {
      venue: 'Class Room',
      timeSlot: '2:00 PM – 3:00 PM',
      handler: 'Gokul',
      contact: { name: 'Gokul', phone: '7373138989' },
      teamSize: 'Individual Only',
      type: 'Individual Only',
      rounds: [
        'Round 1: Break the Fear (Swap emotions of Romantic/Action movie scenes)',
        'Round 2: Critical Thinking (Think Wrong - give opposite answers; Situation Handling - solve critical comedy situations)'
      ]
    }
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'Non-Technical',
    description: 'Capture the essence of the symposium on campus.',
    details: {
      venue: 'Campus Wide',
      timeSlot: 'Full Day',
      handler: 'Kanmani',
      contact: { name: 'Kanmani', phone: '9342247385' },
      teamSize: 'Individual',
      timing: 'Full Day',
      type: 'On Campus',
      rules: [
        'Device: Any device (Phone or Camera)'
      ]
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
        'Duration: Maximum 30 mins',
        'Last Date for Submission: 08/03/2026',
        'Theme: Open Choice',
        'Use any cameras',
        'Avoid already award winning short films',
        'Dont use any copyright songs'
      ]
    }
  },
  {
    id: 'efootball',
    name: 'E-Football (PES)',
    category: 'Online',
    description: 'The ultimate virtual football showdown.',
    details: {
      venue: 'Online',
      timeSlot: 'Will be announced',
      date: '08/03/2026',
      handler: 'B.Bareeth',
      contact: { name: 'B.Bareeth', phone: '8122976882' },
      teamSize: 'Individual (1 vs 1)',
      type: 'Online',
      fee: 50,
      upiId: 'bareeth253@okaxis',
      qrAsset: '/assets/payment-qr-bareeth.jpg',
      rules: [
        'Knockout stage',
        'Mode: 1 vs 1',
        'Match Duration: 6 to 10 minutes',
        'Each participant can register only once',
        'Extra Time & Penalties: On',
        'Condition: Random (Both)',
        'Network issues lead to elimination',
        'Organizer decision is final'
      ]
    }
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    category: 'Online',
    description: 'Squad battle royale for survival.',
    details: {
      venue: 'Online',
      timeSlot: 'Will be announced',
      date: '08/03/2026',
      handler: 'Naveen Raj',
      contact: { name: 'Naveen Raj', phone: '6374520749' },
      teamSize: 'Squad (4 members)',
      type: 'Online',
      fee: 100,
      upiId: 'naveennaveenraj19807@oksbi',
      qrAsset: '/assets/payment-qr-naveen.jpg',
      rules: [
        'Round 1: Bermuda',
        'Round 2: Top 4 teams Semi-final (Clash Squad)',
        'Round 3: Final (Clash Squad)',
        'Contact admin for further details'
      ]
    }
  },
];

export interface Registration {
  id?: number;
  registrationId?: string;
  regType: 'Individual' | 'Team';
  teamName?: string;
  teamMembers?: string;
  memberNames?: string[];
  name: string; // Lead Name
  college: string;
  department: string;
  year: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  events: string[];
  paymentStatus: 'Pending' | 'Completed' | 'Processing';
  paymentScreenshot: string; // base64
  created_at?: string;
}
