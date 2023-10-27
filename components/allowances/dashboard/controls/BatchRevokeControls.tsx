import BatchRevokeButton from 'components/allowances/controls/BatchRevokeButton';
import SelectAllButton from 'components/allowances/controls/SelectAllButton';
import UnselectAllButton from 'components/allowances/controls/UnselectAllButton';
import { useBatchRevoke } from 'lib/hooks/ethereum/useBatchRevoke';
import type { AllowanceData, OnUpdate } from 'lib/interfaces';
import { Address, useAccount, useNetwork } from 'wagmi';

interface Props {
  address: Address;
  chainId: number;
  allowances: AllowanceData[];
  onUpdate: OnUpdate;
  onSelectAll: () => Promise<void>;
  onUnselectAll: () => Promise<void>;
}

const BatchRevokeControls = ({ address, chainId, allowances, onUpdate, onSelectAll, onUnselectAll }: Props) => {
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { revoke: batchRevoke } = useBatchRevoke(allowances, onUpdate);

  const isConnected = !!account;
  const isConnectedAddress = isConnected && address === account;
  const needsToSwitchChain = isConnected && chainId !== chain?.id;
  const hasBatchRevokeButton =
    isConnectedAddress &&
    !needsToSwitchChain &&
    allowances?.some((allowance) => allowance.spender && allowance.checked == true);
  const hasSelectAllButton =
    isConnectedAddress &&
    !needsToSwitchChain &&
    allowances?.some((allowance) => allowance.spender && !allowance.checked);
  const hasUnselectAllButton = hasBatchRevokeButton;

  return (
    <div className="flex items-center gap-2 justify-end">
      {hasBatchRevokeButton ? <BatchRevokeButton revoke={batchRevoke} disabled={false} /> : null}
      {hasSelectAllButton ? <SelectAllButton selectAll={onSelectAll} disabled={false} /> : null}
      {hasUnselectAllButton ? <UnselectAllButton unselectAll={onUnselectAll} disabled={false} /> : null}
    </div>
  );
};

export default BatchRevokeControls;
