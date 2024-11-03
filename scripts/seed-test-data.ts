const axios = require('axios');
require('dotenv').config({ path: './frontend/.env.local' });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function seedTestData() {
  try {
    console.log('Starting to seed test data...');
    console.log('Using Strapi URL:', STRAPI_URL);

    // Create Featured Content
    console.log('Creating Featured Content...');
    const featuredContent = await api.post('/api/featured-contents', {
      data: {
        title: 'Welcome to SOBA',
        description: 'Join our growing community of SOBA holders!',
        type: 'Announcement',
        date: new Date().toISOString(),
      },
    });
    console.log('Created Featured Content:', featuredContent.data);

    // Create Testimonials
    console.log('Creating Testimonials...');
    const testimonial = await api.post('/api/testimonials', {
      data: {
        name: 'John Doe',
        content: 'SOBA has been an amazing community to be part of!',
        role: 'Community Member',
        date: new Date().toISOString(),
      },
    });
    console.log('Created Testimonial:', testimonial.data);

    // Create Milestones
    console.log('Creating Milestones...');
    const milestone = await api.post('/api/milestones', {
      data: {
        phase: 1,
        title: 'Project Launch',
        status: 'Completed',
        description: 'Initial launch of SOBA token',
        details: 'Successful launch on major DEXes',
        completionDate: new Date().toISOString(),
      },
    });
    console.log('Created Milestone:', milestone.data);

    // Create Community Events
    console.log('Creating Community Events...');
    const event = await api.post('/api/community-events', {
      data: {
        title: 'SOBA AMA Session',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Join us for a live AMA with the SOBA team',
        type: 'AMA',
        link: 'https://twitter.com/SOBA',
      },
    });
    console.log('Created Event:', event.data);

    // Create Burn Classifications
    console.log('Creating Burn Classifications...');
    const classification = await api.post('/api/burn-classifications', {
      data: {
        title: 'Regular Burn',
        description: 'Standard token burn event',
        severity: 'Medium',
      },
    });
    console.log('Created Classification:', classification.data);

    // Create Treatment Guidelines
    console.log('Creating Treatment Guidelines...');
    const guideline = await api.post('/api/treatment-guidelines', {
      data: {
        title: 'Basic Treatment',
        description: 'Standard treatment procedure',
        steps: ['Step 1', 'Step 2', 'Step 3'],
      },
    });
    console.log('Created Guideline:', guideline.data);

    console.log('Test data seeded successfully!');
  } catch (error: any) {
    console.error('Error seeding test data:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    process.exit(1);
  }
}

seedTestData();