export default function Gallery() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', title: 'Masa Orientasi', span: 'col-span-12 sm:col-span-6 md:col-span-8', height: 'h-64 md:h-80' },
    { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80', title: 'Praktek Lapangan', span: 'col-span-12 sm:col-span-6 md:col-span-4', height: 'h-64 md:h-80' },
    { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop&q=80', title: 'Pensi Sekolah', span: 'col-span-12 sm:col-span-4 md:col-span-4', height: 'h-64' },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80', title: 'Belajar Bersama', span: 'col-span-12 sm:col-span-8 md:col-span-4', height: 'h-64' },
    { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80', title: 'Ujian Akhir', span: 'col-span-12 sm:col-span-12 md:col-span-4', height: 'h-64' },
  ];

  return (
    <section id="galeri" className="py-20 bg-slate-50 dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Kilas Balik Angkatan</h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Momen-momen tak terlupakan yang telah kita lalui bersama selama 3 tahun terakhir.</p>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          {images.map((img, i) => (
            <div key={i} className={`${img.span} ${img.height} relative group rounded-2xl overflow-hidden shadow-sm`}>
              <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
