import Banner from "@/components/Category/Banner";
import PageServices from "@/lib/api/services/pageServices";

const AboutPage = async () => {
  const pageContent = await PageServices.getPageById(287);
  return (
    <div className="about-page-container">
      <Banner
        title={pageContent.title.rendered}
        breadcrumb={["Home", pageContent.title.rendered]}
      />

      <main className="about-main page-contentarea py-8 px-4 sm:px-6 md:px-6 lg:px-6 xl:px-0 container mx-auto">
        <section className="about-section">
          <div
            dangerouslySetInnerHTML={{
              __html: pageContent?.content?.rendered || "",
            }}
            className="text-slate-600"
          ></div>
          {/* <h2 className="text-2xl font-semibold text-gray-700">Who We Are</h2>
          <p className="mt-4 text-gray-600">
            We are a team of passionate developers, designers, and content creators committed to delivering top-notch digital solutions. 
            Our goal is to provide exceptional service and innovative solutions to help businesses succeed in the ever-evolving digital landscape.
          </p>
        </section>

        <section className="about-section mt-8">
          <h2 className="text-2xl font-semibold text-gray-700">Our Mission</h2>
          <p className="mt-4 text-gray-600">
            Our mission is to empower businesses with the tools and strategies they need to thrive in the digital world. We believe in 
            creating meaningful relationships with our clients and delivering results that exceed expectations.
          </p>
        </section>

        <section className="about-section mt-8">
          <h2 className="text-2xl font-semibold text-gray-700">What We Do</h2>
          <ul className="mt-4 text-gray-600 list-disc pl-5">
            <li>Custom Website Development</li>
            <li>E-commerce Solutions</li>
            <li>UI/UX Design</li>
            <li>Mobile App Development</li>
            <li>Digital Marketing and SEO</li>
          </ul> */}
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
