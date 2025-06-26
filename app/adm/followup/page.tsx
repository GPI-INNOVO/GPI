"use client";
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/Follow/Map_workers'), { ssr: false });
export default function Admin_FollowUp() {

    return (
    <div style={{
      width: '97.5vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <Map/>
    </div>
  );
}
