import { ParsedJob } from "@/utils/parser/types";
import JobCard from "./JobCard";

interface Props {
    jobs: ParsedJob[];
}

const JobList = ({ jobs }: Props) => {
    const onAddCalendar = () => {};

    return (
        <div className="pt-2 flex flex-col gap-2 items-center md:w-3xl w-full h-full overflow-y-auto scrollbar-hide">{jobs.map(job => <JobCard key={job.url} job={job} onAddCalendar={onAddCalendar} />)}</div>
    );
};

export default JobList;