import { Inject, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ){}

  async create(createStudentDto: CreateStudentDto) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@alumnos.uv.cl$/;

    if (!emailRegex.test(createStudentDto.mail)){
      throw new Error('El correo debe terminar en @alumnos.uv.cl');
    }
    try {
      const student = await this.studentRepository.create(createStudentDto);
      return await this.studentRepository.save(student);
    }
    catch (error){
      console.error(error);
    }
  }

  async findAll() {
    return await this.studentRepository.find();
  }

  async findOne(email: string) {
    return await this.studentRepository.findOne({where:
      {
        mail: email
      }
    });
  }

  async update(mail: string, updateStudentDto: UpdateStudentDto) {
    return await this.studentRepository.update(mail, updateStudentDto);
  }

  async remove(mail: string) {
    return await this.studentRepository.delete({mail});
  }
}
