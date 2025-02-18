// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import Mail from 'nodemailer/lib/mailer';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
  private jwtService: JwtService,
  @InjectRepository(User) private userRepository: Repository<User>,
  @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) { }

  async validateOAuthLogin(thirdPartyId: string, provider: string, email: string, rol: string, sede: string): Promise<string> {
    const payload = {
      sub: thirdPartyId,
      provider,
      email,
      rol: rol,
      sede: sede || null
    };

    const jwt = this.jwtService.sign(payload);

    return jwt;
  }

  // localhost:3000/api/auth/google
  async findUser(email: string) {
    const user = await this.userRepository.findOne({where: { mail: email }});
    if (!user) {
      const student = await this.studentRepository.findOne({where: { mail: email }});
      return {email: email, rol: "student", sede: student.sede || null};
    } 
    return {email: email, rol: "admin", sede: user.sede || null};
    

    /*
    //is google || is sso -> con google o con google o con duro  
    const admin = await this.usuarioRepository.find({ where: { correo: email } });
    if (admin.length > 0) {
      //Si es admin
      return { email: email, rol: "admin", sede: admin[0].sede };
    }else{
      //Si el loco es alumno
      const alumno = await this.alumnoRepository.findOne({ where: { correoInstitucional: email } });
      if (alumno==null) {
        //Si no existe
        if(!(/@alumnos\.uv\.cl$/.test(email))){
          return 0;
        }
        const newAlumno = await this.alumnoRepository.create({ correoInstitucional: email });
        await this.alumnoRepository.save(newAlumno);
        return { email: email, rol: "alumno" };        
      }else{
        //Si ya existe
        return { email: email, rol: "alumno", sede: alumno.sede || null };
      }
    }  
  */  
  }
}
