import useTranslation from 'next-translate/useTranslation';
import { useAsyncCallback } from 'react-async-hook';
import Button from '../../common/Button';

interface Props {
  selectAll: () => Promise<void>;
  disabled: boolean;
}

const SelectAllButton = ({ disabled, selectAll }: Props) => {
  const { t } = useTranslation();
  const { execute, loading } = useAsyncCallback(selectAll);

  return (
    <Button disabled={disabled} loading={loading} style="secondary" size="sm" onClick={execute}>
      {t('common:buttons.select_all')}
    </Button>
  );
};

export default SelectAllButton;
