import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

export function renderWithProviders(ui: ReactElement) {
  return render(
    <>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export * from '@testing-library/react';