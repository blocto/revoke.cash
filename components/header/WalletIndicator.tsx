import { useMounted } from 'lib/hooks/useMounted';
import { useRouter } from 'next/router';
import { Address } from 'viem';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import ChainSelect from '../common/ChainSelect';
import WalletIndicatorDropdown from './WalletIndicatorDropdown';

interface Props {
  pageAddress?: Address;
  menuAlign?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'none';
  style?: 'primary' | 'secondary' | 'tertiary' | 'none';
  className?: string;
}

const WalletIndicator = ({ menuAlign, size, style, className, pageAddress }: Props) => {
  const router = useRouter();
  const isMounted = useMounted();
  const { address: account } = useAccount();
  const { switchNetwork } = useSwitchNetwork({
    onSuccess: (data) => {
      if (account && pageAddress && account != pageAddress) {
        router.push({
          pathname: `/address/${account}`,
          query: {
            chainId: data.id,
          },
        });
      }
    },
  });

  const { chain } = useNetwork();

  if (!isMounted) return null;

  return (
    <div className="flex gap-2">
      {account && chain && (
        <ChainSelect
          instanceId="global-chain-select"
          onSelect={switchNetwork}
          selected={chain.id}
          menuAlign={menuAlign}
        />
      )}
      <WalletIndicatorDropdown size={size} style={style} className={className} />
    </div>
  );
};

export default WalletIndicator;
