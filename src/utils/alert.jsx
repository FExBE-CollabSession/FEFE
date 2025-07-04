import Swal from 'sweetalert2';

export const showLoginRequiredAlert = async (navigate) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: '로그인이 필요합니다.',
        showCancelButton: true,
        confirmButtonText: '로그인하기',
        cancelButtonText: '확인',
        customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-swal-button',
            cancelButton: 'custom-swal-button'
        }
    });

    if (result.isConfirmed) {
        navigate("/auth/login");
    }
};

export const showSignupSuccessAlert = async (navigate) => {
    await Swal.fire({
        icon: 'success',
        title: '회원가입이 완료되었습니다!',
        confirmButtonText: '로그인하러 가기',
        customClass: {
            popup: 'custom-swal-popup-register',
            confirmButton: 'custom-swal-button'
        }
    });

    navigate("/auth/login");
};