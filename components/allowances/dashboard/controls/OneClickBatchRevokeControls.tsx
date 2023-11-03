import OneClickBatchRevokeButton from 'components/allowances/controls/OneClickBatchRevokeButton';
import { useBatchRevoke } from 'lib/hooks/ethereum/useBatchRevoke';
import type { AllowanceData, OnUpdate } from 'lib/interfaces';
import { Address, useAccount, useNetwork } from 'wagmi';

interface Props {
  address: Address;
  chainId: number;
  allowances: AllowanceData[];
  onUpdate: OnUpdate;
}

const OneClickBatchRevokeControls = ({ address, chainId, allowances, onUpdate }: Props) => {
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { revoke: batchRevoke } = useBatchRevoke(allowances, onUpdate, false);

  const isConnected = !!account;
  const isConnectedAddress = isConnected && address === account;
  const needsToSwitchChain = isConnected && chainId !== chain?.id;
  const hasBatchRevokeButton =
    isConnectedAddress && !needsToSwitchChain && allowances?.some((allowance) => allowance.spender);

  return (
    <div className="flex items-center gap-2 justify-center">
      {hasBatchRevokeButton ? <OneClickBatchRevokeButton revoke={batchRevoke} disabled={false} /> : null}
    </div>
  );
};

export default OneClickBatchRevokeControls;
