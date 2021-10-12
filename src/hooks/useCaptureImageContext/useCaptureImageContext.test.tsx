import useCaptureImageContext from './useCaptureImageContext';
import { renderHook } from '@testing-library/react-hooks';

describe('the useCaptureImageContext hook', () => {
  it('should throw an error if used outside of the CaptureImageProvider', () => {
    const { result } = renderHook(useCaptureImageContext);
    expect(result.error.message).toBe('useCaptureImageContext must be used within a CaptureImageProvider');
  });
});
