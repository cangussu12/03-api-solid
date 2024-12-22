import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNerarbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNerarbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNerarbyGymsUseCase(gymsRepository);
	});

	it("should be able to fetch nearby gyms", async () => {
		await gymsRepository.create({
			title: "Near Gym",
			description: null,
			phone: null,
			latitude: -22.7889552,
			longitude: -47.3051749,
		});

		await gymsRepository.create({
			title: "Far Gym",
			description: null,
			phone: null,
			latitude: -22.5394293,
			longitude: -47.1701905,
		});

		const { gyms } = await sut.execute({
			userLatitude: -22.7895073,
			userLongitude: -47.3040587,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
	});
});
