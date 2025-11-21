// Test script to verify phases parsing logic

// Test data in different formats
const testData = [
  // String format
  {
    id: 'test1',
    phases: '[{"name":"Phase 1","milestones":[{"completed":true},{"completed":false}]},{"name":"Phase 2","milestones":[{"completed":true}]}]'
  },
  
  // Array format
  {
    id: 'test2',
    phases: [
      {name: "Phase 1", milestones: [{completed: true}, {completed: false}]},
      {name: "Phase 2", milestones: [{completed: true}]}
    ]
  },
  
  // Object format (Prisma JSON)
  {
    id: 'test3',
    phases: {
      "0": {name: "Phase 1", milestones: [{completed: true}, {completed: false}]},
      "1": {name: "Phase 2", milestones: [{completed: true}]}
    }
  },
  
  // Empty data
  {
    id: 'test4',
    phases: null
  },
  
  // Invalid data
  {
    id: 'test5',
    phases: 'invalid json'
  }
];

function parsePhases(phasesData) {
  // Handle phases data - it might be a string or object
  let phases = [];
  
  if (phasesData) {
    if (typeof phasesData === 'string') {
      try {
        phases = JSON.parse(phasesData);
      } catch (e) {
        console.error('Error parsing phases string:', e);
        phases = [];
      }
    } else if (Array.isArray(phasesData)) {
      phases = phasesData;
    } else if (typeof phasesData === 'object') {
      // Handle Prisma JSON objects
      try {
        phases = Object.values(phasesData).filter((value) => 
          typeof value === 'object' && value !== null
        );
      } catch (e) {
        console.error('Error converting phases object to array:', e);
        phases = [];
      }
    }
  }
  
  return phases;
}

// Test the parsing logic
testData.forEach(test => {
  console.log(`\nTesting ${test.id}:`);
  console.log('Input:', JSON.stringify(test.phases, null, 2));
  
  const parsed = parsePhases(test.phases);
  console.log('Parsed:', JSON.stringify(parsed, null, 2));
  
  // Count milestones
  let totalMilestones = 0;
  let completedMilestones = 0;
  
  parsed.forEach(phase => {
    if (phase && typeof phase === 'object' && Array.isArray(phase.milestones)) {
      totalMilestones += phase.milestones.length;
      completedMilestones += phase.milestones.filter(m => 
        m && typeof m === 'object' && m.completed === true
      ).length;
    }
  });
  
  console.log(`Total milestones: ${totalMilestones}`);
  console.log(`Completed milestones: ${completedMilestones}`);
});