import { useNavigate, useParams, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi';
import { getAttendeeAndPresentation } from '../api/client';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import PollDisplay from '../components/PollDisplay';

export default function AttendeeInfo() {
    const { attendeeId } = useParams();

    const { data, loading, error, refetch } = useApi(
        () => (attendeeId ? getAttendeeAndPresentation(attendeeId) : Promise.resolve(null)),
        [attendeeId]
    );
    if (loading) return <p>Loading...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!data) return <div className="alert alert-danger">No attendee found.</div>;
    const { attendee, presentation, responses } = data;

    console.log(responses);

    const isFinished = attendee.status === "Finished";

    const slides = presentation.slides;
    //how to connect slides and poll responses

    return (
        <SectionCard title="Attendee Info">
            <div className='fw-semibold'>
                Name
            </div>
            <div>
                {attendee.name}
            </div>

            <div className='fw-semibold'>
                Attendee of
            </div>
            <div>
                <Link to={`/decks/edit/${presentation.id}`}>
                    {presentation.title}
                </Link>
            </div>

            <div className='fw-semibold'>
                Status
            </div>
            <div>
                {attendee.status}
            </div>

            {!isFinished ? (
                <>
                    <div className='fw-semibold'>
                        Slide index
                    </div>
                    <div>
                        {attendee.slide_index}
                    </div>
                </>
            ) : (
                <>
                </>
            )}

            <div className='fw-semibold'>
                Poll responses
            </div>

            {responses.map((response, i) => (
                <>
                    <div>
                        {response.poll.question}
                    </div>
                    <div>
                        {response.poll.options}
                    </div>
                    <div>
                        {response.option_index}
                    </div>
                </>
            ))}
        </SectionCard>
    );
}