import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { getInvestorBalance } from '@/services/getInvestorBalance';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const useGetInvestorBalance = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const [data, setData] = useState(0);
  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.RECONCILE`,
    },
  });

  const init = async () => {
    if (!investorAccount) return;
    const res = await getInvestorBalance({
      investorAccount,
    });

    if (typeof res === 'number') {
      setData(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [investorAccount]);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;

    subscriptionData.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');

      const txAmount = params.length >= 1 && params[0];
      const senderAccount = params.length >= 2 && params[1];
      const receiverAccount = params.length >= 3 && params[2];

      if (senderAccount && senderAccount.account === investorAccount) {
        setData((prevValue) => prevValue - txAmount);
      }
      if (receiverAccount && receiverAccount.account === investorAccount) {
        setData((prevValue) => prevValue + txAmount);
      }
    });
  }, [subscriptionData]);

  return { data };
};
