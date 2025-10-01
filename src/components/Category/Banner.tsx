
interface BannerProps {
    title: string;
    breadcrumb: string[];
    backgroundUrl?: string;
}
  
export default function Banner({ title, breadcrumb, backgroundUrl }: BannerProps) {
    return (
        <div
            className="w-full h-48 md:h-56 bg-cover bg-center flex items-center px-6"
            style={{
                backgroundImage: `url(${backgroundUrl || '/images/banner-default.png'})`,
            }}
        >
            <div className="container m-auto">
                <div className="text-black drop-shadow-md">
                    <h1 className="text-2xl md:text-4xl font-medium mb-1" dangerouslySetInnerHTML={{ __html: title }}></h1>
                    <p className="text-sm text-black">
                        {breadcrumb.map((item, idx) => (
                        <span key={idx}>
                            {item}
                            {idx < breadcrumb.length - 1 && ' / '}
                        </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
}
  