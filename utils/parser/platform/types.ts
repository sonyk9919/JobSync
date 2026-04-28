import z from "zod";

const BaseJobSchema = z.object({
    "@type": z.literal('JobPosting'),
    title: z.string(),
    validThrough: z.string(),
    employmentType: z.string(),
    experienceRequirements: z.string(),
    hiringOrganization: z.object({ name: z.string() }),
    url: z.string(),
})

export const JobKoreaSchema = BaseJobSchema.extend({
    educationRequirements: z.string(),
});

export type ParsedJobKorea = z.infer<typeof JobKoreaSchema>;