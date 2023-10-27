import ControlsWrapper from 'components/allowances/controls/ControlsWrapper';
import Checkbox from 'components/common/Checkbox';
import { AllowanceData, OnCheck } from 'lib/interfaces';

interface Props {
  allowance: AllowanceData;
  onCheck: OnCheck;
}

const CheckboxCell = ({ allowance, onCheck }: Props) => {
  if (!allowance.spender) return null;

  const handleClick = () => {
    onCheck(allowance, !allowance.checked);
  };

  return (
    <div className="flex justify-center w-28 mr-0 mx-auto">
      <ControlsWrapper chainId={allowance.chainId} address={allowance.owner} switchChainSize={undefined}>
        {(disabled) => (
          <div>
            <Checkbox onClick={handleClick} disabled={disabled} checked={allowance.checked} />
          </div>
        )}
      </ControlsWrapper>
    </div>
  );
};

export default CheckboxCell;
