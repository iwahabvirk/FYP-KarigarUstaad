// API Testing Examples using fetch or Postman

// BASE URL
const BASE_URL = 'http://localhost:5000/api';

// ==================== AUTHENTICATION ====================

// 1. Register User
const registerWorker = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Carpenter',
        email: 'john@example.com',
        password: 'password123',
        role: 'worker',
      }),
    });

    const data = await response.json();
    console.log('Register Response:', data);
    return data.token;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 2. Register Employer
const registerEmployer = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Home Repairs Co',
        email: 'employer@example.com',
        password: 'password123',
        role: 'employer',
      }),
    });

    const data = await response.json();
    console.log('Register Response:', data);
    return data.token;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 3. Login User
const loginUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();
    console.log('Login Response:', data);
    return data.token;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ==================== JOBS ====================

// 4. Create Job (Employer)
const createJob = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Fix Kitchen Cabinet Door',
        description: 'Need to fix a broken cabinet door in kitchen. Please bring your own tools.',
        budget: 150,
        location: 'New York',
        category: 'Carpentry',
        requiredSkills: ['Carpentry', 'Woodwork'],
      }),
    });

    const data = await response.json();
    console.log('Create Job Response:', data);
    return data.job?._id;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 5. Get All Jobs
const getAllJobs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Get All Jobs Response:', data);
    return data.jobs;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 6. Get Jobs with Filters
const getJobsWithFilters = async () => {
  try {
    const query = new URLSearchParams({
      category: 'Carpentry',
      search: 'cabinet',
      minBudget: 100,
      maxBudget: 500,
    });

    const response = await fetch(`${BASE_URL}/jobs?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Filtered Jobs Response:', data);
    return data.jobs;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 7. Get My Jobs (Employer)
const getMyJobs = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/jobs/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Get My Jobs Response:', data);
    return data.jobs;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 8. Get Job Details
const getJobDetails = async (jobId) => {
  try {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Get Job Details Response:', data);
    return data.job;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ==================== APPLICATIONS ====================

// 9. Apply to Job (Worker)
const applyToJob = async (jobId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/applications/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        coverLetter: 'I have 10 years of experience in carpentry and would love to work on this project.',
      }),
    });

    const data = await response.json();
    console.log('Apply to Job Response:', data);
    return data.application?._id;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 10. Get My Applications (Worker)
const getMyApplications = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/applications/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Get My Applications Response:', data);
    return data.applications;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 11. Get Job Applicants (Employer)
const getJobApplicants = async (jobId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}/applicants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Get Job Applicants Response:', data);
    return data.applications;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 12. Update Application Status (Employer)
const updateApplicationStatus = async (applicationId, status, token) => {
  try {
    const response = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status, // 'accepted' or 'rejected'
        rejectionReason: status === 'rejected' ? 'Insufficient experience' : '',
      }),
    });

    const data = await response.json();
    console.log('Update Application Status Response:', data);
    return data.application;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 13. Withdraw Application (Worker)
const withdrawApplication = async (applicationId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/applications/${applicationId}/withdraw`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Withdraw Application Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ==================== WORKFLOW EXAMPLE ====================

const runFullWorkflow = async () => {
  console.log('=== Starting Full Workflow Test ===\n');

  // Step 1: Register employer and worker
  console.log('Step 1: Registering Employer...');
  const employerToken = await registerEmployer();

  console.log('Step 2: Registering Worker...');
  const workerToken = await registerWorker();

  // Step 2: Create a job
  console.log('\nStep 3: Creating Job...');
  const jobId = await createJob(employerToken);

  // Step 3: Get all jobs
  console.log('\nStep 4: Getting all jobs...');
  const jobs = await getAllJobs();

  // Step 4: Apply to job
  console.log('\nStep 5: Worker applying to job...');
  const applicationId = await applyToJob(jobId, workerToken);

  // Step 5: View applications (worker perspective)
  console.log('\nStep 6: Worker viewing their applications...');
  await getMyApplications(workerToken);

  // Step 6: View applicants (employer perspective)
  console.log('\nStep 7: Employer viewing applicants...');
  await getJobApplicants(jobId, employerToken);

  // Step 7: Accept application
  console.log('\nStep 8: Employer accepting application...');
  await updateApplicationStatus(applicationId, 'accepted', employerToken);

  console.log('\n=== Workflow Complete ===');
};

// Export functions for use
module.exports = {
  registerWorker,
  registerEmployer,
  loginUser,
  createJob,
  getAllJobs,
  getJobsWithFilters,
  getMyJobs,
  getJobDetails,
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
  runFullWorkflow,
};
