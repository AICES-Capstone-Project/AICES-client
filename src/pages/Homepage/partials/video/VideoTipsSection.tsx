import { useState } from "react";
import "./videoTips.css";

interface VideoItem {
  id: number;
  title: string;
  embedUrl: string;
}

const videos: VideoItem[] = [
  {
    id: 1,
    title: "Tổng hợp 5 LỖI CV IT khiến CV bị loại trong 60 giây!",
    embedUrl: "https://www.youtube.com/embed/vJDm5j3yDN8?rel=0",
  },
  {
    id: 2,
    title: "Cách trình bày CV IT để gây ấn tượng với nhà tuyển dụng",
    embedUrl: "https://www.youtube.com/embed/vJDm5j3yDN8?rel=0",
  },
  {
    id: 3,
    title: "Checklist CV AI tối ưu trước khi gửi cho HR",
    embedUrl: "https://www.youtube.com/embed/vJDm5j3yDN8?rel=0",
  },
];

export default function VideoTipsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const getPositionClass = (index: number) => {
    if (index === activeIndex) return "video-card video-card--active";

    const prevIndex = (activeIndex - 1 + videos.length) % videos.length;
    const nextIndex = (activeIndex + 1) % videos.length;

    if (index === prevIndex) return "video-card video-card--prev";
    if (index === nextIndex) return "video-card video-card--next";

    return "video-card video-card--hidden";
  };

  return (
    <section className="video-tips-wrapper">
      <div className="video-tips-header">
        <h2 className="video-tips-title">
          Tips viết <span className="video-highlight">CV AI</span> được nhà
          tuyển dụng bật mí
        </h2>
      </div>

      <div className="video-carousel">
        <button
          type="button"
          className="video-arrow video-arrow--left"
          onClick={handlePrev}
        >
          ‹
        </button>

        <div className="video-carousel-inner">
          {videos.map((video, index) => (
            <div key={video.id} className={getPositionClass(index)}>
              <div className="video-frame">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <h3 className="video-caption">{video.title}</h3>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="video-arrow video-arrow--right"
          onClick={handleNext}
        >
          ›
        </button>

        <div className="video-dots">
          {videos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              className={
                "video-dot" +
                (index === activeIndex ? " video-dot--active" : "")
              }
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
