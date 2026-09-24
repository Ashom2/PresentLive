import { useNavigate, useParams } from 'react-router-dom'
import { useAttendee } from '../hooks/useAttendee';
import SectionCard from '../components/SectionCard';

export default function AttendeeInfo() {
    const { attendeeId } = useParams();

    const { attendee, loading, error } = useAttendee(attendeeId);
    if (loading) return <p>Loading...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!attendee) return <div className="alert alert-danger">No attendee found.</div>;

    console.log(attendee);
    return (
        <SectionCard title="Attendee Info">
            askkdoakso
        </SectionCard>
    );
}