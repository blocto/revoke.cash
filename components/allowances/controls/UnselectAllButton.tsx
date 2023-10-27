import useTranslation from 'next-translate/useTranslation';
import { useAsyncCallback } from 'react-async-hook';
import Button from '../../common/Button';

interface Props {
  unselectAll: () => Promise<void>;
  disabled: boolean;
}

const UnselectAllButton = ({ disabled, unselectAll }: Props) => {
  const { t } = useTranslation();
  const { execute, loading } = useAsyncCallback(unselectAll);

  return (
    <Button disabled={disabled} loading={loading} style="secondary" size="sm" onClick={execute}>
      {t('common:buttons.unselect_all')}
    </Button>
  );
};

export default UnselectAllButton;
