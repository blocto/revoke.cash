import { PERMIT2_ABI } from 'lib/abis';
import { ADDRESS_ZERO } from 'lib/constants';
import { AllowanceData, OnUpdate, TransactionType } from 'lib/interfaces';
import { waitForTransactionConfirmation, writeBatchContract } from 'lib/utils';
import { parseFixedPointBigInt } from 'lib/utils/formatting';
import { PERMIT2_ADDRESS } from 'lib/utils/permit2';
import { isErc721Contract } from 'lib/utils/tokens';
import { usePublicClient, useWalletClient } from 'wagmi';
import { useHandleTransaction } from './useHandleTransaction';

export const useBatchRevoke = (
  allowances: AllowanceData[],
  onUpdate: OnUpdate = () => {},
  onlyForChecked: boolean = true,
) => {
  allowances = allowances?.filter((a) => a.spender && (!onlyForChecked || a.checked == true));

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const handleTransaction = useHandleTransaction();

  const revoke = async () => {
    const revokeSingleTransaction = (allowance: AllowanceData) => {
      return {
        ...allowance.contract,
        functionName: 'approve',
        args: [ADDRESS_ZERO, allowance.tokenId],
        account: allowance.owner,
        chain: walletClient.chain,
        value: 0n as any as never, // Workaround for Gnosis Safe, TODO: remove when fixed
      };
    };

    const revokeForAllTransaction = (allowance: AllowanceData) => {
      return {
        ...allowance.contract,
        functionName: 'setApprovalForAll',
        args: [allowance.spender, false],
        account: allowance.owner,
        chain: walletClient.chain,
        value: 0n as any as never, // Workaround for Gnosis Safe, TODO: remove when fixed
      };
    };

    const updateAmountTransaction = (allowance: AllowanceData, newAmountParsed: bigint) => {
      return {
        ...allowance.contract,
        functionName: 'approve',
        args: [allowance.spender, newAmountParsed],
        account: allowance.owner,
        chain: walletClient.chain,
        value: 0n as any as never, // Workaround for Gnosis Safe, TODO: remove when fixed
      };
    };

    const permit2ApproveTransaction = (allowance: AllowanceData, newAmountParsed: bigint) => {
      return {
        address: PERMIT2_ADDRESS,
        abi: PERMIT2_ABI,
        functionName: 'approve',
        args: [allowance.contract.address, allowance.spender, newAmountParsed, allowance.expiration],
        account: allowance.owner,
        chain: walletClient.chain,
        value: 0n as any as never, // Workaround for Gnosis Safe, TODO: remove when fixed
      };
    };

    const transactions = [];
    allowances.forEach((allowance) => {
      if (!allowance) {
        return;
      }

      const { contract, spender, tokenId, expiration } = allowance;

      if (!spender) {
        return;
      }

      if (isErc721Contract(contract)) {
        const transaction =
          tokenId === undefined ? revokeForAllTransaction(allowance) : revokeSingleTransaction(allowance);
        transactions.push(transaction);
      } else {
        const newAmount = '0';
        const newAmountParsed = parseFixedPointBigInt(newAmount, allowance.metadata.decimals);
        const transaction =
          expiration === undefined
            ? updateAmountTransaction(allowance, newAmountParsed)
            : permit2ApproveTransaction(allowance, newAmountParsed);
        transactions.push(transaction);
      }
    });

    const transactionPromise = writeBatchContract(walletClient, transactions);
    const hash = await handleTransaction(transactionPromise, TransactionType.REVOKE);

    if (hash) {
      await waitForTransactionConfirmation(hash, publicClient);

      allowances.forEach((allowance) => {
        if (!allowance) {
          return;
        }

        const { contract, spender } = allowance;

        if (!spender) {
          return;
        }

        if (isErc721Contract(contract)) {
          onUpdate(allowance, undefined);
        } else {
          const newAmount = '0';
          const newAmountParsed = parseFixedPointBigInt(newAmount, allowance.metadata.decimals);
          onUpdate(allowance, newAmountParsed);
        }
      });
    }
  };

  return { revoke };
};
