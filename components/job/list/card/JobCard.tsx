'use client';

import useRegisteredJobs from '@/hooks/store/useRegisteredJobs';
import { CareerType, EducationType, EmploymentType, ParsedJob } from '@/utils/parser/types';
import DateUtils from '@/utils/DateUtils';
import { Calendar } from 'lucide-react';

interface Props {
    job: ParsedJob;
    onAddCalendar: (job: ParsedJob) => void;
}

const JobCard = ({ job, onAddCalendar }: Props) => {
    const { isRegistered } = useRegisteredJobs();

    const getCompanyInitial = (company: string) => {
        return (
            company
                .replace(/[\(\[（【].*?[\)\]）】]/g, '')
                .replace(/[\s㈜㈔㈏㈋]+/g, '')
                .replace(/(주식회사|유한회사|합자회사|합명회사|사회적협동조합|협동조합)/g, '')
                .trim()[0] ?? '?'
        );
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const getAddress = (address: string) => {
        return address.split(' ').slice(0, 2).join(' ');
    };

    const dday = DateUtils.getDday(job.dueDate);

    const onOpenUrl = () => window.open(job.url, '_blank', 'noopener,noreferrer');
    const onClickAddCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onAddCalendar(job);
    };

    return (
        <div
            onClick={onOpenUrl}
            className="bg-white border md:w-3xl w-full border-gray-100 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:border-blue-100 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 bg-blue-300 text-gray-700">
                        {getCompanyInitial(job.company)}
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-gray-400 truncate">{job.company}</div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {job.title}
                        </div>
                    </div>
                </div>
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${DateUtils.getDdayBadgeStyle(dday)}`}
                >
                    {DateUtils.getDdayLabel(dday)}
                </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {job.employmentType !== EmploymentType.UNKNOWN && (
                    <span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
                        {job.employmentType}
                    </span>
                )}
                {job.careerRequirements !== CareerType.UNKNOWN && (
                    <span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
                        {job.careerRequirements}
                    </span>
                )}
                {job.educationType !== EducationType.UNKNOWN && (
                    <span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
                        {job.educationType}
                    </span>
                )}
                <span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
                    {getAddress(job.address)}
                </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                    마감{' '}
                    <span className="text-gray-800 font-medium">{formatDate(job.dueDate)}</span>
                </span>
                <div className="flex items-center gap-2">
                    {isRegistered(job.url) && (
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                            <Calendar className="size-3" />
                            등록됨
                        </span>
                    )}
                    <button
                        onClick={onClickAddCalendar}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-50 duration-150"
                    >
                        <Calendar className="size-4" />
                        캘린더 추가
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
