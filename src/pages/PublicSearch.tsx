import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import SearchResult from '../components/SearchResult';
import Statistics from '../components/Statistics';
import Gallery from '../components/Gallery';
import Mading from '../components/Mading';

export default function PublicSearch() {
  const [result, setResult] = useState<any>(null);

  return (
    <>
      {/* Hide Navbar and Footer when printing */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-grow pt-10">
        {!result ? (
          <>
            <Hero onResult={setResult} />
            <Statistics />
            <Gallery />
            <Mading />
          </>
        ) : (
          <div className="pt-20 pb-10 min-h-[70vh] flex flex-col justify-center bg-slate-50 dark:bg-slate-900 print:bg-white print:p-0 print:m-0 print:min-h-0">
            <SearchResult result={result} onReset={() => setResult(null)} />
          </div>
        )}
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
