import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '@/components/layout/Navbar';


jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

jest.mock('@/features/auth/authStore', () => ({
  useAuthStore: (cb: any) => cb({
    user: { first_name: 'کارآگاه', last_name: 'واحد', roles: [{ name: 'افسر ارشد' }] },
    logout: jest.fn()
  }),
}));

describe('تست‌های واحد داشبورد سامانه LA Noire', () => {
  
  test('۱. نمایش نام افسر در نوار ابزار', () => {
    render(<Navbar />);
    const officerName = screen.getByText(/کارآگاه واحد/i);
    expect(officerName).toBeInTheDocument();
  });

  test('۲. وجود فیلد جستجوی پرونده‌ها', () => {
    render(<Navbar />);
    const searchInput = screen.getByPlaceholderText(/جستجوی عنوان پرونده یا شماره/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('۳. وجود دکمه خروج از سامانه', () => {
    render(<Navbar />);
    const logoutBtn = screen.getByText(/خروج/i);
    expect(logoutBtn).toBeInTheDocument();
  });

  test('۴. بررسی وجود آیکون اعلان‌ها', () => {
    render(<Navbar />);
    const notificationBadge = screen.getByText('۳');
    expect(notificationBadge).toBeInTheDocument();
  });

  test('۵. بررسی نقش کاربری در هدر', () => {
    render(<Navbar />);
    const roleBadge = screen.getByText(/افسر ارشد/i);
    expect(roleBadge).toBeInTheDocument();
  });
});