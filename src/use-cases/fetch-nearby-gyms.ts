import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@Prisma/client";

interface FetchNerarbyGymsUseCaseRequest {
	userLatitude: number;
	userLongitude: number;
}

interface FetchNerarbyGymsUseCaseResponse {
	gyms: Gym[];
}

export class FetchNerarbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: FetchNerarbyGymsUseCaseRequest): Promise<FetchNerarbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});

		return {
			gyms,
		};
	}
}
