import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';

interface OurRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface OurEvent {
  timestamp: number;
  duration: number;
  zone: OurRect;
  id: number;
  title: string;
}

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [events, setEvents] = useState<OurEvent[]>([]);
  const video = useRef<HTMLVideoElement>(null);

  function onTimeUpdate(e: SyntheticEvent<HTMLVideoElement>) {
    setCurrentTime((e.target as HTMLVideoElement).currentTime);
  }

  function setTimeStamp(timestamp: number): void {
    if (video.current) {
      video.current.currentTime = timestamp;
    }
  }

  function rectCalc(r: OurRect): OurRect {
    return !video.current ? r : {
      left: r.left * video.current.clientWidth / video.current.videoWidth,
      top: r.top * video.current.clientHeight / video.current.videoHeight,
      width: r.width * video.current.clientWidth / video.current.videoWidth,
      height: r.height * video.current.clientHeight / video.current.videoHeight,
    } as OurRect;
  }

  let eventsLoading = false;

  useEffect(() => {
    if (eventsLoading) {
      return;
    }
    eventsLoading = true;
    
    (async () => {
      try {
        const result = await axios<OurEvent[]>(
          'https://run.mocky.io/v3/085041d6-c0a5-4d4c-8ba9-829a0212d75b',
        );
        result.data.map((event, index) => {
          event.id = index;
          event.title = '' + Math.floor(event.timestamp / 60) + ':' + (event.timestamp % 60).toFixed(3);
        })
        setEvents(result.data);
      } catch (e) {
        console.error(e);
      }
    })()
  }, []);

  return (
    <div className="myapp">
      <div className="video-container">
        <video className="video" autoPlay muted controls onTimeUpdate={onTimeUpdate} ref={video}>
          <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
        {events
          .filter(event => event.timestamp <= currentTime && currentTime <= event.timestamp + event.duration)
          .map(event => (
            <div key={ 'rect-' + event.id } className="rectangle" style={{ ...rectCalc(event.zone) }}></div>
          ))
        }
      </div>
      <aside className="aside">
        {events.map(event => (
          <div
            key={ 'event-' + event.id }
            className="seek"
            onClick={() => setTimeStamp(event.timestamp)}
          >
            {event.title}
          </div>
        )
        )}
      </aside>
    </div >
  )
}
