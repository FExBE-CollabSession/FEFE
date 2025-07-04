import { createGlobalStyle } from 'styled-components';

const SwalGlobalStyle = createGlobalStyle`
  .custom-swal-popup {
    border-radius: 15px;
    font-family: 'Arial', sans-serif;
  }

  .custom-swal-button {
    border-radius: 8px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s ease;
  }

  .custom-swal-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .swal2-confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  }

  .swal2-cancel {
    background: #6c757d !important;
  }
`;

export default SwalGlobalStyle; 