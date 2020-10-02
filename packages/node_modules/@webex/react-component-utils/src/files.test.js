import {FILE_ATTACHMENT_MAX_SIZE} from './constants';
import {checkMaxFileSize} from './files';

describe('files utilities', () => {
  describe('checkMaxFileSize()', () => {
    let addError, files;

    beforeEach(() => {
      addError = jest.fn();
    });

    describe('when all files are under file size limit', () => {
      beforeEach(() => {
        files = [{size: FILE_ATTACHMENT_MAX_SIZE - 1}];
      });

      it('returns true when all files are under file size limit', () => {
        expect(checkMaxFileSize(files, addError)).toBe(true);
      });

      it('does not call addError', () => {
        checkMaxFileSize(files, addError);
        expect(addError).not.toHaveBeenCalled();
      });
    });

    describe('when a file is over the file size limit', () => {
      beforeEach(() => {
        files = [{size: FILE_ATTACHMENT_MAX_SIZE + 1}];
      });

      it('returns false', () => {
        expect(checkMaxFileSize(files, addError)).toBe(false);
      });

      it('calls addError', () => {
        checkMaxFileSize(files, addError);
        expect(addError).toHaveBeenCalled();
      });
    });
  });
});
