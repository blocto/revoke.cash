import useTranslation from 'next-translate/useTranslation';
import { useAsyncCallback } from 'react-async-hook';
import Button from '../../common/Button';

interface Props {
  revoke: () => Promise<void>;
  disabled: boolean;
}

const OneClickBatchRevokeButton = ({ disabled, revoke }: Props) => {
  const { t } = useTranslation();
  const { execute, loading } = useAsyncCallback(revoke);

  return (
    <Button disabled={disabled} loading={loading} style="primary" size="lg" onClick={execute}>
      {loading ? t('common:buttons.revoking') : t('common:buttons.one_click_revoke')}
    </Button>
  );
};

export default OneClickBatchRevokeButton;
