const employerController = {
  getCurrentJobs: (req, res) => {
    res.render('Abhishek/current_jobs', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'current_jobs'
    });
  },

  getJobListings: (req, res) => {
    res.render('Abhishek/job_listing', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'job_listings'
    });
  },

  getProfile: (req, res) => {
    res.render('Abhishek/profile', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'profile'
    });
  },

  getTransactionHistory: (req, res) => {
    res.render('Abhishek/transaction', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'transaction_history'
    });
  },

  getMilestones: (req, res) => {
    res.render('Abhishek/milestone', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'transaction_history'
    });
  },

  getPreviouslyWorked: (req, res) => {
    res.render('Abhishek/previously_worked', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'previously_worked'
    });
  },
  getSubscription: (req, res) => {
    res.render('Abhishek/subscription', {
      user: { name: 'TechCorp Solutions' },
      activePage: 'subscription'
    });
  }
};

module.exports = employerController;