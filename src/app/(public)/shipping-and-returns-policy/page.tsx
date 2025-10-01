import Banner from "@/components/Category/Banner";
import PageServices from "@/lib/api/services/pageServices";

const ShippingPage = async () => {
  const pageContent = await PageServices.getPageById(292);
  return (
    <div className="page-container">
      <Banner
        title={pageContent.title.rendered}
        breadcrumb={["Home", pageContent.title.rendered]}
      />

      <main className="page-contentarea py-8 px-4 sm:px-6 md:px-6 lg:px-6 xl:px-0 container mx-auto">
        <section className="about-section">
          <div
            dangerouslySetInnerHTML={{
              __html: pageContent?.content?.rendered || "",
            }}
            className="text-slate-600"
          ></div>
        </section>
      </main>
    </div>
  );
};

export default ShippingPage;