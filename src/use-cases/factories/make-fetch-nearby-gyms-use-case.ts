import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNerarbyGymsUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymsUseCase() {
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new FetchNerarbyGymsUseCase(gymsRepository);

	return useCase;
}
