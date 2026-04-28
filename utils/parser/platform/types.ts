import z from "zod";

const BaseJobSchema = z.object({
    "@type": z.literal('JobPosting'),
    validThrough: z.string().optional(),
    employmentType: z.string().optional(),
    experienceRequirements: z.string().optional(),
    hiringOrganization: z.object({ name: z.string() }),
    url: z.string(),
})

export const JobKoreaSchema = BaseJobSchema.extend({
    educationRequirements: z.string(),
});
export type ParsedJobKorea = z.infer<typeof JobKoreaSchema>;

export const JobPlanetSchema = BaseJobSchema.extend({});
export type ParsedJobPlanet = z.infer<typeof JobPlanetSchema>;