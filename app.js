/**
 * KTU (APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY) REDESIGN JS
 * Pure Static Vanilla JavaScript — No Frameworks, No Emojis.
 * Handles Standalone Login Redirect, View Switching, Search Modal, and Results Engine.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STANDALONE LOGIN FORM & REDIRECT SYSTEM (login.html)
  // =========================================================================
  const standaloneLoginForm = document.getElementById('standaloneLoginForm');
  const loginRegNo = document.getElementById('loginRegNo');
  const loginPassword = document.getElementById('loginPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const regNoError = document.getElementById('regNoError');
  const passwordError = document.getElementById('passwordError');
  const loginErrorAlert = document.getElementById('loginErrorAlert');

  // Toggle Password Show/Hide
  if (togglePasswordBtn && loginPassword) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPwd = loginPassword.type === 'password';
      loginPassword.type = isPwd ? 'text' : 'password';
      togglePasswordBtn.textContent = isPwd ? 'Hide' : 'Show';
      togglePasswordBtn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
    });
  }

  // Handle Login Validation & Redirect to index.html
  if (standaloneLoginForm) {
    standaloneLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      if (regNoError) regNoError.textContent = '';
      if (passwordError) passwordError.textContent = '';
      if (loginErrorAlert) {
        loginErrorAlert.style.display = 'none';
        loginErrorAlert.textContent = '';
      }

      const regVal = loginRegNo ? loginRegNo.value.trim() : '';
      const pwdVal = loginPassword ? loginPassword.value.trim() : '';

      let isValid = true;

      if (!regVal) {
        if (regNoError) regNoError.textContent = 'Please enter your KTU Registration Number.';
        isValid = false;
      }

      if (!pwdVal) {
        if (passwordError) passwordError.textContent = 'Please enter your student password.';
        isValid = false;
      }

      // Preserve registration number value if validation fails
      if (!isValid) {
        if (loginErrorAlert) {
          loginErrorAlert.style.display = 'block';
          loginErrorAlert.textContent = 'Please complete all required fields below.';
        }
        return;
      }

      // Clear password input immediately (Never store passwords in localStorage/sessionStorage!)
      loginPassword.value = '';

      // Render redirect notice and redirect into index.html
      if (loginErrorAlert) {
        loginErrorAlert.style.display = 'block';
        loginErrorAlert.style.backgroundColor = '#EAE3F3';
        loginErrorAlert.style.borderColor = '#B9A8D5';
        loginErrorAlert.style.color = '#2C1E4A';
        loginErrorAlert.innerHTML = `
          <strong>Authentication Validated</strong><br>
          Logging in student <strong>${regVal}</strong>... Redirecting to KTU Student Portal.
        `;
      }

      setTimeout(() => {
        window.location.href = 'portal.html';
      }, 700);
    });
  }

  // =========================================================================
  // 2. VIEW CONTROLLER (HOME, EXAMINATIONS, RESULTS IN index.html)
  // =========================================================================
  const viewSections = document.querySelectorAll('.view-section');
  const navTabs = document.querySelectorAll('.nav-tab, .mobile-nav-btn');

  function switchView(targetViewId) {
    if (!targetViewId) return;

    // Hide all view sections
    viewSections.forEach(sec => {
      sec.classList.remove('active-view');
    });

    // Show selected target section
    const targetSection = document.getElementById(`view-${targetViewId}`);
    if (targetSection) {
      targetSection.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active tab buttons
    navTabs.forEach(tab => {
      if (tab.dataset.view === targetViewId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    closeMobileDrawer();
  }

  // Bind view switching triggers throughout the DOM
  document.querySelectorAll('[data-switch-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = el.getAttribute('data-switch-view');
      if (targetView) switchView(targetView);
    });
  });

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.view) switchView(tab.dataset.view);
    });
  });

  // =========================================================================
  // 3. SEARCH & QUICK SEARCH MODAL
  // =========================================================================
  const searchModal = document.getElementById('searchModal');
  const searchModalOpen = document.getElementById('searchModalOpen');
  const searchModalClose = document.getElementById('searchModalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalSearchInput = document.getElementById('modalSearchInput');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchForm = document.getElementById('heroSearchForm');
  const tagChips = document.querySelectorAll('.tag-chip');

  function openSearchModal(initialQuery = '') {
    if (searchModal) {
      searchModal.classList.add('open');
      searchModal.setAttribute('aria-hidden', 'false');
      if (modalSearchInput) {
        modalSearchInput.value = initialQuery;
        modalSearchInput.focus();
      }
    }
  }

  function closeSearchModal() {
    if (searchModal) {
      searchModal.classList.remove('open');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (searchModalOpen) searchModalOpen.addEventListener('click', () => openSearchModal());
  if (searchModalClose) searchModalClose.addEventListener('click', closeSearchModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeSearchModal);

  // Keyboard shortcut Cmd+K / Ctrl+K & Escape key
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      closeMobileDrawer();
    }
  });

  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = heroSearchInput ? heroSearchInput.value.trim() : '';
      openSearchModal(q);
    });
  }

  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (q.includes('Result')) switchView('results');
      else if (q.includes('Timetable') || q.includes('Exam')) switchView('examination');
      else openSearchModal(q);
    });
  });

  document.querySelectorAll('.hint-card').forEach(card => {
    card.addEventListener('click', () => {
      const trigger = card.dataset.trigger;
      closeSearchModal();
      if (trigger === 'results') switchView('results');
      else if (trigger === 'examination') switchView('examination');
    });
  });

  // =========================================================================
  // 4. NOTIFICATION CATEGORY FILTER TABS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const notifItems = document.querySelectorAll('.notif-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const val = tab.dataset.filter;
      notifItems.forEach(item => {
        if (val === 'all' || item.dataset.category === val) {
          item.style.display = 'grid';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. INTERACTIVE RESULTS PORTAL ENGINE
  // =========================================================================
  const resultsForm = document.getElementById('resultsSearchForm');
  const resultsDisplayArea = document.getElementById('resultsDisplayArea');
  const regNoInput = document.getElementById('resRegisterNo');
  const semInput = document.getElementById('resSemester');
  const dobInput = document.getElementById('resDOB');

  const demoS8Btn = document.getElementById('demoResultBTechS8');
  const demoS6Btn = document.getElementById('demoResultBTechS6');

  const mockDatabase = {
    "TVE21CS045": {
      studentName: "ANANTHANARAYANAN V.",
      registerNo: "TVE21CS045",
      institution: "College of Engineering Trivandrum (CET)",
      branch: "Computer Science & Engineering",
      semester: "Semester 8 (S8)",
      examSession: "May / June 2026 Regular Examination",
      publishedDate: "October 02, 2026",
      sgpa: "9.24",
      cgpa: "9.08",
      status: "PASS (FIRST CLASS WITH DISTINCTION)",
      courses: [
        { code: "CST402", title: "Distributed Computing", credits: 4, grade: "S", gradeClass: "grade-S", status: "Pass" },
        { code: "CST404", title: "Comprehensive Course Viva", credits: 2, grade: "A+", gradeClass: "grade-Aplus", status: "Pass" },
        { code: "CSD416", title: "Project Phase II (Major Project)", credits: 6, grade: "S", gradeClass: "grade-S", status: "Pass" },
        { code: "CSD414", title: "High Performance Computing Seminar", credits: 2, grade: "A+", gradeClass: "grade-Aplus", status: "Pass" },
        { code: "CST466", title: "Elective V: Cloud Computing", credits: 3, grade: "A", gradeClass: "grade-A", status: "Pass" }
      ]
    },
    "TVE21CS088": {
      studentName: "DEVAPRIYA M. NAIR",
      registerNo: "TVE21CS088",
      institution: "College of Engineering Trivandrum (CET)",
      branch: "Computer Science & Engineering",
      semester: "Semester 6 (S6)",
      examSession: "May 2026 Regular Examination",
      publishedDate: "September 24, 2026",
      sgpa: "8.65",
      cgpa: "8.52",
      status: "PASS (FIRST CLASS)",
      courses: [
        { code: "CST302", title: "Compiler Design", credits: 4, grade: "A+", gradeClass: "grade-Aplus", status: "Pass" },
        { code: "CST304", title: "Computer Networks", credits: 4, grade: "A", gradeClass: "grade-A", status: "Pass" },
        { code: "CST306", title: "Algorithm Analysis & Design", credits: 4, grade: "B+", gradeClass: "grade-Bplus", status: "Pass" },
        { code: "CSL332", title: "Networking Lab", credits: 2, grade: "S", gradeClass: "grade-S", status: "Pass" }
      ]
    }
  };

  function renderLoadingState() {
    if (!resultsDisplayArea) return;
    resultsDisplayArea.innerHTML = `
      <div class="result-placeholder-box">
        <h3>Fetching Verified Digital Grade Sheet...</h3>
        <p>Connecting to KTU Centralized Student Database (Security Authenticated).</p>
      </div>
    `;
  }

  function renderResultSheet(data) {
    if (!resultsDisplayArea) return;

    let rowsHTML = data.courses.map(c => `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td>${c.title}</td>
        <td>${c.credits}</td>
        <td><span class="grade-pill ${c.gradeClass}">${c.grade}</span></td>
        <td><strong style="color: #166534;">${c.status}</strong></td>
      </tr>
    `).join('');

    resultsDisplayArea.innerHTML = `
      <div class="result-sheet-container">
        <div class="result-sheet-header">
          <div>
            <span class="sheet-badge">OFFICIAL VERIFIED GRADE CARD</span>
            <h2 style="font-size: 1.75rem; margin-top: 0.35rem;">APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY</h2>
            <p style="font-size: 0.875rem; color: var(--text-dark-sub);">${data.examSession}</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.75rem; color: var(--text-dark-muted); font-weight: 800;">PUBLISHED DATE</span>
            <div style="font-weight: 800; font-size: 0.9375rem;">${data.publishedDate}</div>
          </div>
        </div>

        <div class="student-info-grid">
          <div class="info-item">
            <span>Student Name</span>
            <strong>${data.studentName}</strong>
          </div>
          <div class="info-item">
            <span>Register Number</span>
            <strong>${data.registerNo}</strong>
          </div>
          <div class="info-item">
            <span>Institution / College</span>
            <strong>${data.institution}</strong>
          </div>
          <div class="info-item">
            <span>Branch / Programme</span>
            <strong>${data.branch}</strong>
          </div>
          <div class="info-item">
            <span>Semester</span>
            <strong>${data.semester}</strong>
          </div>
          <div class="info-item">
            <span>Result Status</span>
            <strong style="color: #15803D;">${data.status}</strong>
          </div>
        </div>

        <div class="result-table-wrapper">
          <table class="result-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </div>

        <div class="result-summary-bar">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-lavender-dark);">SEMESTER SGPA</span>
            <div class="sgpa-score">${data.sgpa}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-lavender-dark);">CUMULATIVE CGPA</span>
            <div class="sgpa-score">${data.cgpa}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-lavender-dark);">ACADEMIC STANDING</span>
            <div style="font-weight: 800; font-size: 1.125rem; color: var(--text-lavender-dark);">DISTINCTION</div>
          </div>
        </div>

        <div class="result-actions-bar">
          <button class="btn-black-pill" onclick="window.print();">Print Grade Sheet (PDF)</button>
          <button class="btn-lavender-pill" id="btnRequestReval">Apply for Revaluation</button>
        </div>
      </div>
    `;

    const revalBtn = document.getElementById('btnRequestReval');
    if (revalBtn) {
      revalBtn.addEventListener('click', () => {
        alert(`Revaluation portal opened for Register No: ${data.registerNo}. Application fee: Rs. 600 per paper.`);
      });
    }
  }

  function handleResultSearch(regNo) {
    renderLoadingState();
    setTimeout(() => {
      const clean = regNo.toUpperCase().trim();
      const data = mockDatabase[clean] || mockDatabase["TVE21CS045"];
      renderResultSheet(data);
    }, 400);
  }

  if (resultsForm) {
    resultsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = regNoInput ? regNoInput.value : 'TVE21CS045';
      handleResultSearch(val);
    });
  }

  if (demoS8Btn) {
    demoS8Btn.addEventListener('click', () => {
      if (regNoInput) regNoInput.value = "TVE21CS045";
      if (semInput) semInput.value = "S8";
      if (dobInput) dobInput.value = "15/08/2003";
      handleResultSearch("TVE21CS045");
    });
  }

  if (demoS6Btn) {
    demoS6Btn.addEventListener('click', () => {
      if (regNoInput) regNoInput.value = "TVE21CS088";
      if (semInput) semInput.value = "S6";
      if (dobInput) dobInput.value = "22/11/2004";
      handleResultSearch("TVE21CS088");
    });
  }

  // =========================================================================
  // 6. MOBILE DRAWER SYSTEM
  // =========================================================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  function openMobileDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);

});
