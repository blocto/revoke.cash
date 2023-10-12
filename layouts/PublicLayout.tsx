import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import { Address } from 'viem';

interface Props {
  children: React.ReactNode;
  pageAddress?: Address;
  searchBar?: boolean;
}

const PublicLayout = ({ children, pageAddress, searchBar = true }: Props) => {
  return (
    <div className="flex flex-col mx-auto min-h-screen gap-4">
      <Header searchBar={searchBar} pageAddress={pageAddress} />
      <main className="max-w-7xl w-full mx-auto px-4 lg:px-8 grow mb-8">{children}</main>
      <div className="flex flex-col justify-end">
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
