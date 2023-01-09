import { ethers } from "ethers";
import { createContext, useContext, useState } from "react";

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

interface DataContextProps {
  account: string;
  loading: boolean;
  loadWallet: () => Promise<void>;
  sendPayment: ({
    amount,
    toAddress,
  }: {
    amount: any;
    toAddress: any;
  }) => Promise<any>;
  balance: number;
}

interface sendPaymentProps {
  amount: string;
  toAddress: string;
}

const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);

  const loadWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const allAccounts = await provider.listAccounts();
        setAccount(allAccounts[0]);

        const bal = await provider.getBalance(allAccounts[0]);
        setBalance(
          parseFloat(parseFloat(ethers.utils.formatEther(bal)).toFixed(4))
        );
      } else {
        alert("Please install Metamask at https://metamask.io");
      }
      setLoading(false);
    } else {
      alert("Non-Eth browser detected. Please consider using MetaMask.");
    }
  };

  const sendPayment = async ({ amount, toAddress }: sendPaymentProps) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let bal = await provider.getBalance(account);
      if (ethers.utils.formatEther(bal) < amount) {
        return "You don't have enough balance";
      }

      await signer
        .sendTransaction({
          to: toAddress,
          value: ethers.utils.parseEther(amount),
        })
        .then(async () => {
          bal = await provider.getBalance(account);
          setBalance(
            parseFloat(parseFloat(ethers.utils.formatEther(bal)).toFixed(4))
          );
        });
      return "Payment success";
    } catch (e: any) {
      return e.message;
    }
  };

  return {
    account,
    loading,
    loadWallet,
    sendPayment,
    balance,
  };
};
