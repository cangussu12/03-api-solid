import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "JavaScript Gym",
			description: null,
			phone: null,
			latitude: -22.7895073,
			longitude: -47.3040587,
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -22.7895073,
			userLongitude: -47.3040587,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be ble to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -22.7895073,
			userLongitude: -47.3040587,
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: -22.7895073,
				userLongitude: -47.3040587,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should be able to check in twice but in different days", async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -22.7895073,
			userLongitude: -47.3040587,
		});

		vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -22.7895073,
			userLongitude: -47.3040587,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			title: "JavaScript Gym",
			description: "",
			phone: "",
			latitude: new Decimal(-22.7894128),
			longitude: new Decimal(-47.2895721),
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -22.7889552,
				userLongitude: -47.3051749,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
