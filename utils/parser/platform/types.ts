import z from "zod";

const BaseJobSchema = z.object({
    "@type": z.literal('JobPosting'),
    title: z.string(),
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

export const WantedSchema = BaseJobSchema.extend({
    experienceRequirements: z.array(z.string()).optional(),
})
export type ParsedWanted = z.infer<typeof WantedSchema>;