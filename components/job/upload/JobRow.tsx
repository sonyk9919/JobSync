import IconButton from '@/components/common/IconButton';
import useRegisteredJobs from '@/hooks/store/useRegisteredJobs';
import DateUtils from '@/utils/DateUtils';
import { ParsedJob } from '@/utils/parser/types';
import { CheckSquare, ExternalLink, Square } from 'lucide-react';

interface Props {
    job: ParsedJob;
    selected: boolean;
    onSelect: (url: string) => void;
}

const JobRow = ({ job, selected, onSelect }: Props): React.ReactNode => {
    const { isRegistered } = useRegisteredJobs();
    const dday = DateUtils.getDday(job.dueDate);

    const onOpenUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(job.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-xl hover:border-blue-100 duration-150 cursor-pointer"
            onClick={() => onSelect(job.url)}
        >
            {selected ? (
                <CheckSquare className="size-4 text-blue-400 shrink-0" />
            ) : (
                <Square className="size-4 text-gray-300 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 truncate">{job.company}</div>
                <div className="text-sm font-medium text-gray-900 truncate">{job.title}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {isRegistered(job.url) && <span className="text-xs text-blue-400">등록됨</span>}
                <span className={`text-xs font-medium ${DateUtils.getDdayTextStyle(dday)}`}>
                    {DateUtils.getDdayLabel(dday)}
                </span>
                <IconButton onClick={onOpenUrl}>
                    <ExternalLink className="size-3.5" />
                </IconButton>
            </div>
        </div>
    );
};

export default JobRow;
