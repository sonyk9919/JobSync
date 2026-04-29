import { ParsedJob } from "@/utils/parser/types";
import JobCard from "./JobCard";
import useJobCalendarModal from "@/hooks/store/useJobCalendarModal";

interface Props {
    jobs: ParsedJob[];
}

const JobList = ({ jobs }: Props) => {
    const { initForm } = useJobCalendarModal();

    return (
        <div className="pt-2 flex flex-col gap-2 items-center md:w-3xl w-full h-full overflow-y-auto scrollbar-hide">{jobs.map(job => <JobCard key={job.url} job={job} onAddCalendar={initForm} />)}</div>
    );
};

export default JobList;